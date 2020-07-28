import { axios } from '@/utils/request'

export function getMonitorUrl () {
  return axios.get('monitor/v1/das')
}
