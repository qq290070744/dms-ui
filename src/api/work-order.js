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
