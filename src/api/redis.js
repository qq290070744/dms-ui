import { axios } from '@/utils/request'
import { genPage } from './utils'

const Ver = 'v1'
const Prefix = '/query/' + Ver + '/redis'

const p = (path) => Prefix + (path || '')

export function page (parameter) {
  return axios.get(p('/keys'), {
    data: { params: parameter }
  }).then((data) => {
    return genPage(data, parameter)
  })
}

export function key (params) {
  return axios.post(p('/key'), params)
}

export function search (params) {
  return axios.post(p('/search'), params)
}

export function instances (parameter) {
  const records = [
    { id: 1, name: '123123' },
    { id: 2, name: '444444' },
  ]
  return Promise.resolve(genPage({ records }, parameter))
}
