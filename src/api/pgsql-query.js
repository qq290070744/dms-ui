import { dbs, tables, genTableApi } from './base-db-query'

const {
  fields,
  indexes,
  querySql
} = genTableApi('pgsql')

export {
  dbs,
  tables,
  fields,
  indexes,
  querySql
}
