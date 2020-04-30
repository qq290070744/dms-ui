import { axios } from '@/utils/request'

const Ver = 'v1'
const Prefix = '/query/' + Ver + '/redis'

const p = (path) => Prefix + (path || '')
/**
 *
 * @param {{
  "db_name": string,
  "exact": boolean,
  "inst_id": number,
  "pattern": string
}} parameter 参数
 */
export function search (parameter) {
  return axios.post(p('/keys'), parameter)
}

export function key (params) {
  return axios.post(p('/keys/' + params.type), params)
}

export function types (params) {
  return axios.post(p('/keys/type'), params)
}

export function ttl (params) {
  return axios.post(p('/keys/ttl'), params)
}

export function size (params) {
  return axios.post(p('/dbs/size'), params)
}
