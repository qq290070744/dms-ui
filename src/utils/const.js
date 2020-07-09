const def = (o, k, v) => {
  Object.defineProperty(
    o,
    k,
    {
      get () {
        return v
      }
    }
  )
}

class Enum {
  static parse (item, index, offset) {
    index += offset
    index += ''
    if (typeof item === 'string') {
      return {
        key: item,
        value: index,
        label: item
      }
    }
    if (Array.isArray(item)) {
      const [key, label = key, value = index] = item
      return { key, value, label }
    } else {
      const { key, value = index, label = key, ...rest } = item
      return {
        key,
        value,
        label,
        ...rest
      }
    }
  }

  constructor (items = [], offset = 0) {
    this.$label = {}
    this.$map = {}
    this.$items = []
    items.forEach((item, index) => {
      item = Enum.parse(item, index, offset)
      def(this, item.key, item.value)
      this.$label[item.value] = item.label
      this.$map[item.value] = item
      this.$items.push(item)
    })
  }
}

// 工单类型
export const DMS_ORDER_TYPE = new Enum([
  'MySQL-DDL',
  'MySQL-DML',
  'Redis',
  'MongoDB',
  'PgSQL',
  // 'msSQL',
  // ['ELSE', '其他'],
])

export function dmsBaseOrderType (value) {
  const key = DMS_ORDER_TYPE.$map[value].key
  return key.replace(/-.+$/, '').toLowerCase()
}

export function isMysqlOrder (value) {
  return dmsBaseOrderType(value) === 'mysql'
}

// 工单状态
export const DMS_MODIFY_ORDER_STATUS = new Enum([
  { key: 'REJECT', label: '已驳回', color: '#ff6666' },
  { key: 'SUCCESS', label: '执行成功', color: '#00c024' },
  { key: 'CHECK_PENDING', label: '待审核', color: '#2db7f5' },
  { key: 'IN_PROGRESS', label: '待审核', color: '#2db7f5' },
  { key: 'FAIL', label: '待审核', color: '#ff6666' },
  { key: 'CANCEL', label: '待审核', color: '#bbb' },
])

// 实例类型
export const DMS_INSTANCE_TYPE = new Enum([
  'MySQL',
  'Redis',
  'MongoDB',
  'PgSQL',
  // 'msSQL',
], 1)

export const DMS_PERMS_ORDER_TYPE = new Enum([
  { key: 'CHECK_PENDING', label: '待审核', color: '#2db7f5' },
  { key: 'REJECT', label: '驳回', color: '#ff6666' },
  { key: 'SUCCESS', label: '通过', color: '#00c024' },
], 1)
