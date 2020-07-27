import { axios } from '@/utils/request'

const Ver = 'v1'
const Prefix = '/dbmgr/' + Ver + '/redis'

const p = (path) => Prefix + (path || '')

export function page (params = {}) {
  return axios.get(p(), { params, xPagination: true })
}

export function create (params) {
  return ping(params).then(() => {
    return axios.post(p(), params)
  }, (e) => Promise.reject(e))
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
