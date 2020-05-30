import { axios } from '@/utils/request'

/**
 * 获取用户列表
 */
export function getUserList(data) {
  return axios({
    url: '/auth/users',
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
    url: `/auth/users/${id}`,
    method: 'get'
  })
}
/**
 * 获取数据库实例列表
 */
export function getDatabase() {
  return axios({
    url: '/common/v1/dbs',
    method: 'get'
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
 * 实例和schema的关联
 */
export function associatedChema(data) {
  return axios({
    url: '/auth/grant/db_schemas',
    method: 'put',
    data
  })
}
/**
 * 获取用户的资源授权信息
 */
export function getAuthByUserId(data) {
  return axios({
    url: '/auth/grant/user_resource',
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
