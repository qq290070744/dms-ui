export function parseSql (sql, pos) {
  if (!pos) {
    return sql
  }

  const { column, lineNumber } = pos

  const sqlArr = sql.split('\n')

  const beforeLen = sqlArr.slice(0, lineNumber - 1).join('\n').length // 上面的总长度
  const curr = sqlArr[lineNumber - 1]
  const leftLen = beforeLen + column

  const b4CorsurCharIndex = column - 2
  const afterSemiAndLast = curr[b4CorsurCharIndex] === ';' // 光标是否在分号后面

  if (afterSemiAndLast) {
    const afterSemi = Math.max(sql.lastIndexOf(';', leftLen), 0)
    const prevSemi = sql.lastIndexOf(';', afterSemi - 1)

    return sql.slice(
      (prevSemi < 0 ? 0 : prevSemi + 1),
      afterSemi + 1 // 分号位置
    ).trim()
  } else {
    const cursorPos = beforeLen + b4CorsurCharIndex
    const prevSemi = sql.lastIndexOf(';', cursorPos)
    const afterSemi = sql.indexOf(';', cursorPos + 1)

    return sql.slice(
      (prevSemi < 0 ? 0 : prevSemi + 1),
      (afterSemi < 0 ? (sql.length) : afterSemi) + 1 // 分号位置
    ).trim()
  }
}
