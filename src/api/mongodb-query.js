import { genDBApi } from './base-db-query'
import { axios } from '@/utils/request'

const Prefix = 'work_order/mongodb'

const p = (path) => Prefix + (path || '')

const {
  dbs,
  tables,
  fields,
  indexes
} = genDBApi(p)

function querySql (params) {
  return axios.post(p('/mongo_data'), params)
}

export {
  dbs,
  tables,
  fields,
  indexes,
  querySql
}
