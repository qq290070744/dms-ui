import { axios } from '@/utils/request'
import { genPage, transform } from './utils'

export function createWorkOrder (params) {
  return axios.post('/work_order/submit_work_order', params)
}

export function myReviewWorkOrder (params) {
  return axios.get('/work_order/my_assigned_order', { params: transform(params) }).then((data) => {
    return genPage(data, params)
  })
}

export function mySubmitWorkOrder (params) {
  return axios.get('/work_order/my_order', { params: transform(params) }).then((data) => {
    return genPage(data, params)
  })
}

export function workOrderByKey (keyname) {
  return axios.post('/work_order/q_redis_key', { keyname })
}

export function execWorkOrder (id, type) {
  return axios.post(`/work_order/${type}/exec`, { work_id: id })
}

export function rejectWorkOrder (id, rejected) {
  return axios.post(`/work_order/rejected_work_order`, { work_id: id, rejected })
}

export function queryWorkOrderExection (id) {
  return axios.get(`/work_order/get_order_exec_info`, { params: { work_id: id } })
}

export function beautySql (params) {
  return axios.post('/work_order/mysql/beauty', params)
}
