import { dbs, tables, genTableApi } from './base-db-query'

const {
  fields,
  indexes,
  querySql
} = genTableApi('mongodb')

export {
  dbs,
  tables,
  fields,
  indexes,
  querySql
}
