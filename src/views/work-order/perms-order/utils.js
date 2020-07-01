export const statusMap = [
  ['待审核', '#2db7f5'],
  ['已驳回', '#ff6666'],
  ['已通过', '#00c024'],
]
export const types = ['', 'MySql', 'Redis', 'MongoDb', 'PolarDB']

export const statusOptions = statusMap.map(([label], value) => ({ label, value }))
