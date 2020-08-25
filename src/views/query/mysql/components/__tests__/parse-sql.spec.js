import { parseSql } from '../parse-sql'

const pos = (column, lineNumber) => ({ column, lineNumber })

const normalString = `123456789;
987654321;
`
describe('test parse: normal', () => {
  const expectString = `123456789;`
  test('cursor in start', () => {
    expect(
      parseSql(normalString, pos(1, 1))
    )
      .toBe(expectString)
  })

  test('cursor in middle', () => {
    expect(
      parseSql(normalString, pos(5, 1))
    )
      .toBe(expectString)
  })

  test('cursor in end', () => {
    expect(
      parseSql(normalString, pos(11, 1))
    )
      .toBe(expectString)
  })

  test('cursor in end of lastline', () => {
    expect(
      parseSql(normalString, pos(11, 2))
    )
      .toBe(`987654321;`)
  })
})

const splitString = `
1234
56789;

1234

56
789;
`
describe('split', () => {
  const expectString = `1234

56
789;`
  test('split', () => {
    expect(parseSql(splitString, pos(1, 5))).toBe(expectString)
  })
  test('split', () => {
    expect(parseSql(splitString, pos(3, 7))).toBe(expectString)
  })
})

const mixinString = `
1234
56789

;  1234

56
789;
`

describe('mixin', () => {
  const expectString1 = `1234

56
789;`
  const expectString2 = `1234
56789

;`
  test('center', () => {
    expect(parseSql(mixinString, pos(3, 5))).toBe(expectString1)
  })
  test('cursor after semi', () => {
    expect(parseSql(mixinString, pos(2, 5))).toBe(expectString2)
  })
})
