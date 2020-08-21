import { axios } from '@/utils/request'

export function getOutsouring () {
  return axios({
    method: 'get',
    url: '/upms/v1/outsourcing'
  })
}

/**
 * 设置外包组管理员
 * @param {object} data
 * @param {number} data.leader_id
 * @param {number} data.group_id
 */
export function setOutsouringLeader (data) {
  return axios({
    method: 'put',
    url: '/upms/v1/outsourcing',
    data
  })
}
