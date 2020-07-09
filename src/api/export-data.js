import { axios } from '@/utils/request'

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

export function rejectApply (params) {
  return axios
    .post(
      '/ticket/v1/data_export/reject',
      params
    )
}

export function myApplyList (params) {
  return axios
    .get(
      '/ticket/v1/data_export/self',
      { params }
    )
}

export function myReviewList (params) {
  return axios
    .get(
      '/ticket/v1/data_export',
      { params }
    )
}
