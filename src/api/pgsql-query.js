import { genDBApi } from './base-db-query'

const Prefix = 'work_order/pgsql'

const p = (path) => Prefix + (path || '')

const {
  dbs,
  tables,
  fields,
  indexes,
  querySql
} = genDBApi(p)

export {
  dbs,
  tables,
  fields,
  indexes,
  querySql
}
