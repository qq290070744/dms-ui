import { axios } from '@/utils/request'
import { genPage, transform } from './utils'

const Ver = 'v1'
const Prefix = '/dbmgr/' + Ver + '/redis'

const p = (path) => Prefix + (path || '')

export function page (parameter = {}) {
  return axios.get(p(), { params: transform(parameter) }).then((data) => {
    return genPage(data, parameter)
  })
}

export function create (params) {
  return ping(params).then(() => {
    return axios.post(p(), params)
  })
}

export function update (params) {
  return ping(params).then(() => {
    return axios.put(p('/' + params.id), params)
  })
}

export function remove (params) {
  return axios.delete(p('/' + params.id))
}

export function ping ({ password, host, port }) {
  return axios.post(p('/ping'), { password, host, port })
}
