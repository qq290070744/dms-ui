import { axios } from '@/utils/request'

export function queryAllUser () {
  return axios.get('/auth/users')
}

export function queryApprovalUser () {
  return axios.get('/auth/approvals/user')
}
