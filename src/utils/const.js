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
  const item = DMS_ORDER_TYPE.$map[value]
  return item ? item.key.replace(/-.+$/, '').toLowerCase() : ''
}

export function canRollbackOrder (value) {
  return DMS_ORDER_TYPE.PgSQL === value || dmsBaseOrderType(value) === 'mysql'
}

// 工单状态
export const DMS_MODIFY_ORDER_STATUS = new Enum([
  { key: 'REJECT', label: '已驳回', color: '#ff6666' },
  { key: 'SUCCESS', label: '执行成功', color: '#00c024' },
  { key: 'CHECK_PENDING', label: '待审核', color: '#2db7f5' },
  { key: 'IN_PROGRESS', label: '执行中', color: '#2db7f5' },
  { key: 'FAIL', label: '执行失败', color: '#ff6666' },
  { key: 'CANCEL', label: '撤销', color: '#bbb' },
])

// 实例类型
export const DMS_INSTANCE_TYPE = new Enum([
  { key: 'MySQL', port: 3306 },
  { key: 'Redis', port: 6379 },
  { key: 'MongoDB', port: 27017 },
  { key: 'PgSQL', port: 5432 },
  // 'msSQL',
], 1)

export const DMS_PERMS_ORDER_TYPE = new Enum([
  { key: 'CHECK_PENDING', label: '待审核', color: '#2db7f5' },
  { key: 'REJECT', label: '已驳回', color: '#ff6666' },
  { key: 'SUCCESS', label: '已通过', color: '#00c024' },
], 1)

export const DMS_ORDER_EXEC_TYPE = new Enum([
  { key: 'SUCCESS', label: '成功', color: '#00c024' },
  { key: 'WARNING', label: '成功（有警告）', color: '#fa8c16' },
  { key: 'FAIL', label: '失败', color: '#ff6666' },
])
