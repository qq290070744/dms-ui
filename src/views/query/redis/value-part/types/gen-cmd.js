/**
 * 添加 hsetnx key field value
 * 更新 hset key field value
 * 删除 hdel key field
 */

export function genHashActionCommand (actions) {
  return actions.map(({ action, key, field, value }) => {
    return [ action, key, field, value ].filter(v => !!v).join(' ')
  })
}

export function genHashActionPayload (actions) {
  return actions.map(({ action, key, field, value }) => {
    return { action, payload: [ key, field, value ].filter(v => !!v) }
  })
}

// const hashKeys = ['field', 'value']
export function genHashAction (modifiedRecords, key) {
  modifiedRecords = Object.keys(modifiedRecords).map(k => modifiedRecords[k]).filter(v => !!v)

  const removed = (_modified, origin) => {
    const { field } = origin
    return { action: 'HDEL', key, field }
  }
  const statusAction = {
    added (modified, _origin) {
      const { field, value } = modified
      if (!field || !value) {
        return false
      } else {
        return { action: 'HSETNX', key, field, value }
      }
    },
    removed,
    modified (modified, origin) {
      const result = ['field', 'value'].reduce((obj, k) => {
        if (modified[k] && modified[k] !== origin[k]) {
          obj[k] = modified[k]
        }
        return obj
      }, {})

      if (!Object.keys(result).length) {
        return false
      }

      if (result.field) {
        const command = [
          removed(modified, origin),
          { action: 'HSET', key, value: origin.value, ...result }
        ]
        return command
      } else {
        return { action: 'HSET', key, ...result }
      }
    }
  }

  const actions = modifiedRecords.map((record) => {
    const [status, modified, origin] = record
    if (statusAction[status]) {
      return statusAction[status](modified, origin)
    }
    return false
  })
    .filter(v => !!v)
    .reduce((actions, action) => {
      if (Array.isArray(action)) {
        return actions.concat(...action)
      }
      return actions.concat(action)
    }, [])

  return { actions: genHashActionPayload(actions), commands: genHashActionCommand(actions) }
}

/**
 * 头部 lpush key value
 * 尾部 rpush key value
 * 设置 lset key index value
 * 删除 lrem key index
*/

export function genListAction (modifiedRecords, key) {
  console.log('modifiedRecords', modifiedRecords)

  return { actions: [], commands: [] }
}
