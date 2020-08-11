import { axios } from '@/utils/request'

export function queryAllUser () {
  return axios.get('/auth/users')
}

export function queryApprovalUser (backup) {
  const url = backup ? '/common/v1/approver' : '/upms/v1/approver'
  return axios.get(url).then((result) => {
    return result.map(u => ({ label: u.name, value: u.id }))
  })
}
