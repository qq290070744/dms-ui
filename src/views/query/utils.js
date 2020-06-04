// 0 MySQL ddl，1 MySQL dml，2 redis , 3 mongodb , 4 pgsql , 5 mssql ,  6 其他
export const MYSQL_DDL_TYPE = '0'
export const MYSQL_DML_TYPE = '1'
export const REDIS_TYPE = '2'
// export const orderType = ['MySQL ddl', 'MySQL dml', 'redis', 'mongodb', 'pgsql', 'mssql', '其他']

export function isMysqlType (type) {
  return [
    MYSQL_DDL_TYPE,
    MYSQL_DML_TYPE
  ].includes(type)
}
