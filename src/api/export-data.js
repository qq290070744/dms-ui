import { axios } from '@/utils/request'
import { genPage, transform } from './utils'

export function applyExport (params) {
  return axios
    .post(
      '/ticket/v1/data_export/apply',
      params
    )
}

// approve reject
export function approveApply (order_id) {
  return axios
    .post(
      '/ticket/v1/data_export/approve',
      { order_id }
    )
}

export function rejectApply (order_id) {
  return axios
    .post(
      '/ticket/v1/data_export/reject',
      { order_id }
    )
}

export function myApplyList (params) {
  return axios
    .get(
      '/ticket/v1/data_export/self',
      { params: transform(params) }
    ).then((data) => {
      return genPage(data, params)
    })
}

export function myReviewList (params) {
  return axios
    .get(
      '/ticket/v1/data_export',
      { params: transform(params) }
    ).then((data) => {
      return genPage(data, params)
    })
}
