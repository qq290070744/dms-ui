import { genDBApi } from './base-db-query'

const Ver = 'v1'
const Prefix = '/query/' + Ver + '/mysql'

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
