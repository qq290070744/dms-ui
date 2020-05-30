import { axios } from '@/utils/request'

/**
 * 获取角色列表
 */
export function getRoles(data) {
  return axios({
    url: '/auth/roles',
    method: 'get',
    params: data
  })
}
/**
 * 新增角色
 */
export function createRole(data) {
  return axios({
    url: '/auth/roles',
    method: 'post',
    data
  })
}
/**
 * 编辑角色
 */
export function editRole(id, data) {
  return axios({
    url: `/auth/roles/${id}`,
    method: 'put',
    data
  })
}
/**
 * 删除角色
 */
export function deleteRole(id, data) {
  return axios({
    url: `/auth/roles/${id}`,
    method: 'delete',
    data
  })
}
/**
 * 获取角色详细信息
 */
export function getRoleDetail(id) {
  return axios({
    url: `/auth/roles/${id}`,
    method: 'get'
  })
}
