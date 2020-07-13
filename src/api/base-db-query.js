import { axios } from '@/utils/request'

const uids = { d: 0, t: 0, f: 0, i: 0 }
function uuid (type) {
  return type + (++uids[type])
}

export function genDBApi (p) {
  // inst_id => string[]
  function dbs (parameter) {
    return axios.post(p('/dbs'), parameter).then((result) => {
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
  function tables (params) {
    return axios.post(p('/dbs/tbs'), params).then((result) => {
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

  // inst_id, db_name, tb_name => fields[]
  function fields (params) {
    return axios.post(p('/dbs/tbs/fields'), params).then((result) => {
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
    return axios.post(p('/dbs/tbs/index'), params).then((result) => {
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
    return axios.post(p('/content'), params)
  }

  return {
    dbs,
    tables,
    fields,
    indexes,
    querySql
  }
}
