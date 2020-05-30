import { axios } from '@/utils/request'

const Ver = 'v1'
const Prefix = '/query/' + Ver + '/mysql'

const p = (path) => Prefix + (path || '')

const uids = { d: 0, t: 0, f: 0, i: 0 }
function uuid (type) {
  return type + (++uids[type])
}

// inst_id => string[]
export function dbs (parameter) {
  return axios.post(p('/dbs'), parameter).then((result) => {
    return (result.records || result).map((name) => ({ uid: uuid('d'), level: 1, children: [], name }))
  })
}

// inst_id, db_name => string[]
export function tables (params) {
  return axios.post(p('/dbs/tbs'), params).then((result) => {
    return (result.records || result).map((name) => ({ uid: uuid('t'), level: 2, db: params.db_name, isLeaf: true, children: [], name }))
  })
}

// inst_id, db_name, tb_name => fields[]
export function fields (params) {
  return axios.post(p('/dbs/tbs/fields'), params).then((result) => {
    return result.map((field) => ({ uid: uuid('f'), level: 3, ...field }))
  })
}

// inst_id, db_name, tb_name => index[]
export function indexes (params) {
  return axios.post(p('/dbs/tbs/index'), params).then((result) => {
    return result.map((index) => ({ uid: uuid('i'), level: 3, ...index }))
  })
}

// inst_id, db_name, sql
export function querySql (params) {
  return axios.post(p('/content'), params)
}
