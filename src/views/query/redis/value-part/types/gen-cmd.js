function filterRecords (modifiedRecords) {
  return Object.keys(modifiedRecords).map(k => modifiedRecords[k]).filter(v => !!v)
}

/**
 * 添加 hsetnx key field value
 * 更新 hset key field value
 * 删除 hdel key field
 */

/**
 * 头部 lpush key value
 * 尾部 rpush key value
 * 设置 lset key index value
 * 删除 lrem key index
*/

const typeHandler = {
  string ({ key, modified }) {
    const { value, oldValue } = modified
    const action = oldValue ? 'set' : 'setnx'
    return [
      [action, key, value]
    ]
  },
  list ({ key, modified, unshift, push, removed }) {
    let result = []
    if (unshift && unshift.length) {
      result = result.concat(
        unshift.map(({ value }) => {
          return value ? ['LPUSH', key, value] : false
        }).filter(v => !!v).reverse()
      )
    }

    if (push && push.length) {
      result = result.concat(
        push.map(({ value }) => {
          return value ? ['RPUSH', key, value] : false
        }).filter(v => !!v)
      )
    }

    modified = filterRecords(modified)
    if (modified.length) {
      result = result.concat(
        modified.map(([, mRecord, mKeys]) => {
          if (!Object.keys(mKeys).length) { return false }
          return ['LSET', key, mRecord.index, mRecord.value]
        }).filter(v => !!v)
      )
    }

    if (removed && removed.length) {
      const REMOVED_VAL = '__REDIS_LIST_VALUE_REMOVED_BY_DMS__'
      result = result.concat(
        removed.map(({ index }) => {
          return [
            ['LSET', key, index, REMOVED_VAL],
            ['LREM', key, 0, REMOVED_VAL]
          ]
        })
      )
    }

    return result
  },
  hash ({ key, modified, push, removed }) {
    const removedFn = (origin) => {
      const { field } = origin
      return ['HDEL', key, field]
    }
    let result = []
    if (push && push.length) {
      result = result.concat(
        push.map(({ field, value }) => {
          return field && value ? ['HSETNX', key, field, value] : false
        }).filter(v => !!v)
      )
    }
    const removedMap = {}
    removed = Object.values(removed)
    if (removed && removed.length) {
      result = result.concat(
        removed.map((obj) => {
          removedMap[obj.key] = true
          return removedFn(obj)
        })
      )
    }
    modified = filterRecords(modified)
    if (modified.length) {
      result = result.concat(
        modified.map(([record, mRecord, mKeys]) => {
          if (!Object.keys(mKeys).length || removedMap[record.key]) { return false }
          if (mKeys.field) {
            const command = [
              removedFn(record),
              ['HSET', key, mRecord.field, mRecord.value]
            ]
            return command
          } else {
            return ['HSET', key, mRecord.field, mRecord.value]
          }
        }).filter(v => !!v)
      )
    }
    return result
  },
  set ({ key, modified, push, removed }) {
    const addFn = (key, value) => ['SADD', key, value]
    const removedFn = (key, value) => ['SREM', key, value]
    let result = []
    if (push && push.length) {
      result = result.concat(
        push.map(({ value }) => {
          return value ? addFn(key, value) : false
        }).filter(v => !!v)
      )
    }

    modified = filterRecords(modified)
    if (modified.length) {
      result = result.concat(
        modified.map(([record, mRecord, mKeys]) => {
          if (!Object.keys(mKeys).length) { return false }
          return [
            removedFn(key, record.value),
            addFn(key, mRecord.value)
          ]
        }).filter(v => !!v)
      )
    }

    if (removed && removed.length) {
      result = result.concat(
        removed.map(({ value }) => {
          return [
            removedFn(key, value)
          ]
        })
      )
    }

    return result
  },
  zset ({ key, modified, push, removed }) {
    const removedFn = (origin) => {
      const { value } = origin
      return ['ZREM', key, value]
    }
    let result = []
    if (push && push.length) {
      result = result.concat(
        push.map(({ score, value }) => {
          return score && value ? ['ZADD', key, score, value] : false
        }).filter(v => !!v)
      )
    }
    const removedMap = {}
    removed = Object.values(removed)
    if (removed && removed.length) {
      result = result.concat(
        removed.map((obj) => {
          removedMap[obj.key] = true
          return removedFn(obj)
        })
      )
    }
    modified = filterRecords(modified)
    if (modified.length) {
      result = result.concat(
        modified.map(([record, mRecord, mKeys]) => {
          if (!Object.keys(mKeys).length || removedMap[record.key]) { return false }
          if (mKeys.value) {
            const command = [
              removedFn(record),
              ['ZADD', key, mRecord.score, mRecord.value]
            ]
            return command
          } else {
            return ['ZADD', key, mRecord.score, mRecord.value]
          }
        }).filter(v => !!v)
      )
    }
    return result
  },
}

export function genActions (type, payload) {
  const result = typeof typeHandler[type] === 'function'
    ? typeHandler[type](payload)
    : []
  if (payload.ttl) {
    result.push(['expire', payload.key, payload.ttl])
  }

  const toCommand = (actions) => {
    return actions.reduce((commands, action) => {
      if (action && typeof action[0] === 'string') {
        commands.push(action.join(' '))
      } else {
        commands.push(...toCommand(action))
      }
      return commands
    }, [])
  }

  const commands = toCommand(result)

  return { commands, actions: [] }
}
