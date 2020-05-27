import { axios } from '@/utils/request'

/**
 * 获取角色列表
 */
export function getUserList(data) {
  return axios({
    url: '/auth/users',
    method: 'get',
    data
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
