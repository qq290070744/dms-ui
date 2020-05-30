import { axios } from '@/utils/request'
/**
 * 获取菜单&按钮列表
 */
export function getMenuTree() {
  return axios({
    url: '/auth/menu_bar/tree',
    method: 'get'
  })
}
export function getMenuUserTree() {
  return axios({
    url: '/auth/menu_bar/user_tree',
    method: 'get'
  })
}
/**
 * 新增菜单
 */
export function createMenuTree(data) {
  return axios({
    url: '/auth/menu_bar/menus',
    method: 'post',
    data
  })
}
/**
 * 删除菜单
 */
export function deleteMenu(id) {
  return axios({
    url: `/auth/menu_bar/menus/${id}`,
    method: 'delete'
  })
}
/**
 * 编辑菜单
 */
export function editMenu(id, data) {
  return axios({
    url: `/auth/menu_bar/menus/${id}`,
    method: 'put',
    data
  })
}
/**
 * 获取API列表
 */
export function getApiList() {
  return axios({
    url: '/common/v1/apis',
    method: 'get'
  })
}
/**
 * 关联API
 */
export function associatedApi(data) {
  return axios({
    url: '/auth/menu_bar/grant/actions',
    method: 'put',
    data
  })
}
/**
 * 获取菜单已关联api
 */
export function getApiListByMenu(id) {
  return axios({
    url: `/auth/menu_bar/actions/${id}`,
    method: 'get'
  })
}
