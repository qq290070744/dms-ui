import { axios } from '@/utils/request'

/**
 * 获取用户列表
 */
export function getUserList(data) {
  return axios({
    url: '/upms/v1/users',
    method: 'get',
    params: data
  })
}
/**
 * 用户和角色关联
 */
export function associatedUserRole(data) {
  return axios({
    url: '/auth/grant/user_role',
    method: 'put',
    data
  })
}
/**
 * 获取用户信息
 */
export function getUserInfo(id) {
  return axios({
    url: `/upms/v1/users/${id}`,
    method: 'get'
  })
}
/**
 * 获取数据库实例列表
 */
export function getDatabase(params) {
  return axios({
    url: '/instance/v1/authorization/instances',
    method: 'get',
    params
  })
}
/**
 * 用户和数据库实例关联
 */
export function associatedUserDatabase(data) {
  return axios({
    url: '/auth/grant/user_dbs',
    method: 'put',
    data
  })
}
/**
 * 实例id获取库表结构-mysql
 */
export function getDatabaseBySql(params) {
  return axios({
    url: '/core/mysql/v1/query/schema/tree',
    method: 'get',
    params
  })
}
/**
 * 实例id获取库表结构-mongo
 */
export function getDatabaseByMongo(params) {
  return axios({
    url: '/core/mongodb/v1/query/schema/tree',
    method: 'get',
    params
  })
}
/**
 * 实例id获取库表结构-pgsql
 */
export function getDatabaseByPgsql(params) {
  return axios({
    url: '/core/pgsql/v1/query/schema/tree',
    method: 'get',
    params
  })
}
/**
 * 实例id获取库表结构
 */
export function getDatabaseById(data) {
  return axios({
    url: '/query/v1/mysql/schema_tree',
    method: 'get',
    params: data
  })
}
/**
 * 授权数据库实例和库表权限
 */
export function associatedSchema(data) {
  return axios({
    url: '/instance/v1/authorization/schemas',
    method: 'put',
    data
  })
}
/**
 * 获取用户的资源授权信息
 */
export function getAuthByUserId(data) {
  return axios({
    url: '/instance/v1/authorization/schema/tree',
    method: 'get',
    params: data
  })
}
/**
 * redis审计日志
 */
export function getRedisLog(data) {
  return axios({
    url: '/query/v1/redis_log',
    method: 'get',
    params: data
  })
}
/**
 * mysql审计日志
 */
export function getMysqlLog(data) {
  return axios({
    url: '/query/v1/mysql_log',
    method: 'get',
    params: data
  })
}

/**
 * 查看pgsql审计日志
 * @param {object} params
 * @param {number} params.inst_id - 实例id
 * @param {number} params.page - 当前页码
 * @param {number} params.page_size - 页面返回数据量
 * @param {string} params.username - 用户名
 * @return {#/definitions/model.ListLogResp} - OK
 */
export function apiGetWorkOrderPgsqlPgsqlLog(params) {
  return axios({
    url: '/work_order/pgsql/pgsql_log',
    method: 'get',
    params,
  })
}

/**
 * 查看mongo审计日志
 * @param {object} params
 * @param {number} params.page - 当前页码
 * @param {number} params.page_size - 页面返回数据量
 * @param {string} params.username - 用户名
 * @param {number} params.inst_id - 实例id
 * @return {#/definitions/model.ListLogResp} - OK
 */
export function apiGetWorkOrderMongodbMongoLog(params) {
  return axios({
    url: '/work_order/mongodb/mongo_log',
    method: 'get',
    params,
  })
}

//  获取用户拥有的数据库实例的列表
export function getUserAuthInstance(data) {
  return axios({
    url: '/instance/v1/authorization/instance/self',
    method: 'get',
    params: data
  })
}
