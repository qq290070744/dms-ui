export const orderStatus = ['驳回', '执行成功', '待审核', '执行中', '执行失败', '撤销']
export const PENDING_WO = '2'
export const FINISHED_WO = '1'
export const HAS_RESULT_STATUS = ['1', '3', '4']
export const ORDER_EXECUTING = '3'

export const orderType = ['MySQL DDL', 'MySQL DML', 'redis'] // , 'mongodb', 'pgsql', 'mssql', '其他'
export const execType = ['mysql', 'mysql', 'redis'] // , 'mongodb', 'pgsql', 'mssql', 'else'

export const orderStatusOptions = orderStatus.map((label, value) => ({ label, value: String(value) }))
export const orderTypeOptions = orderType.map((label, value) => ({ label, value }))
