import { axios } from '@/utils/request'

export function createWorkOrder (params) {
  return axios.post('/work_order/submit_work_order', params)
}
