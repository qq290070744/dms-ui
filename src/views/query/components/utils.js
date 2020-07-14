export function genSuggestions (databases, database, fields) {
  const fds = ['字段', fields]
  const dbs = ['库', databases.map(db => db.name)]
  const dbn = database ? database.name : ''
  const tbs = [dbn + '表', database ? database.children.map(tb => tb.name) : []]
  return [dbs, tbs, fds]
}
