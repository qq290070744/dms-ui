import { axios } from '@/utils/request'

export function queryAllUser () {
  return axios.get('/auth/users')
}

export function queryApprovalUser () {
  return axios.get('/upms/v1/approver').then((result) => {
    return result.map(u => ({ label: u.name, value: u.id }))
  })
}
