import { axios } from '@/utils/request'

const uids = { d: 0, t: 0, f: 0, i: 0 }
function uuid (type) {
  return type + (++uids[type])
}

export function genTableApi (type) {
  const prefix = `/core/${type}/v1/query`
  // inst_id, db_name, tb_name => fields[]
  function fields (params) {
    return axios.get(`${prefix}/schema/fields`, { params }).then((result) => {
      return result
        .map((field) => ({
          uid: uuid('f'),
          level: 3,
          ...field
        }))
    })
  }

  // inst_id, db_name, tb_name => index[]
  function indexes (params) {
    return axios.get(`${prefix}/schema/index`, { params }).then((result) => {
      return result
        .map((index) => ({
          uid: uuid('i'),
          level: 3,
          ...index
        }))
    })
  }

  // inst_id, db_name, sql
  function querySql (params) {
    return axios.post(`${prefix}/content`, params)
  }

  return {
    indexes,
    fields,
    querySql
  }
}

// inst_id => string[]
export function dbs (params) {
  return axios.get('/instance/v1/authorization/schema/dbs', { params }).then((result) => {
    return (result.records || result)
      .map((name) => ({
        uid: uuid('d'),
        level: 1,
        children: [],
        name
      }))
  })
}

// inst_id, db_name => string[]
export function tables (params) {
  return axios.get('/instance/v1/authorization/schema/tbs', { params }).then((result) => {
    return (result.records || result)
      .map((name) => ({
        uid: uuid('t'),
        level: 2,
        db: params.db_name,
        isLeaf: true,
        children: [],
        name
      }))
  })
}
