export function parseSql (sql, pos) {
  if (!pos) {
    return sql
  }

  const { column, lineNumber } = pos

  const sqlArr = sql.split('\n')

  const beforeLen = sqlArr.slice(0, lineNumber - 1).join('\n').length
  const curr = sqlArr[lineNumber - 1]
  const leftLen = beforeLen + column
  // 光标在分号后面
  const afterSemiAndLast = curr[column - 2] === ';'
  if (afterSemiAndLast) {
    const afterSemi = Math.max(sql.lastIndexOf(';', leftLen), 0)
    const prevSemi = sql.lastIndexOf(';', afterSemi - 1)

    return sql.slice(
      (prevSemi < 0 ? 0 : prevSemi + 1),
      afterSemi + 1 // 分号位置
    ).trim()
  } else {
    const prevSemi = sql.lastIndexOf(';', leftLen)
    const afterSemi = sql.indexOf(';', leftLen - 1)
    return sql.slice(
      (prevSemi < 0 ? 0 : prevSemi + 1),
      (afterSemi < 0 ? (sql.length) : afterSemi) + 1 // 分号位置
    ).trim()
  }
}
