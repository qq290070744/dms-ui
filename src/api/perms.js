import { axios } from '@/utils/request'
import { genPage, transform } from './utils'
// 实例列表
export function getInstance(params) {
  return axios({
    url: '/common/v1/instances/self',
    method: 'get',
    params
  })
}

// 过滤后的库表树
export function getDatabaseSchema (instId) {
  return axios({
    url: '/common/v1/instances/schema_tree',
    method: 'get',
    params: { inst_id: instId }
  }).then(({ schemas }) => {
    return schemas.reduce((list, res) => {
      const { db, tables } = res

      const children = tables.map((tb) => ({
        ...tb,
        db_name: db.name,
        parent: db
      }))

      db.children = children
      list.push(db, ...children)

      return list
    }, [])
  })
}

export function applyPerms (params) {
  return axios.post('/ticket/v1/schema/apply', params)
}

export function myApplyPermsWO (params) {
  return axios.get('/ticket/v1/schema/self', { params: transform(params) }).then((data) => {
    return genPage(data, params)
  })
}

export function myAuditPermsWO (params) {
  return axios.get('/ticket/v1/schema', { params: transform(params) }).then((data) => {
    return genPage(data, params)
  })
}

export function rejectPermsWO (orderId) {
  return axios.post('/ticket/v1/schema/reject', { order_id: orderId })
}

export function approvePermsWO (orderId) {
  return axios.post('/ticket/v1/schema/approve', { order_id: orderId })
}
