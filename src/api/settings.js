import { axios } from '@/utils/request'

export const GH_OSC = '_gh_osc'
export const PT_OSC = '_pt_osc'
export const CUTSOM_LEVEL = '_custom_audit_level'
/**
 * 获取MySQL审核选项
 */
export function getPolicies (method = '') {
  return axios.get(`/work_order/audit_options/get${method}`)
}
/**
* 设置MySQL审核选项
*/
export function setPolicies (params, method = '') {
  return axios.post(`/work_order/audit_options/set${method}`, params)
}
