export function genPage (data, parameter) {
  data.current = parameter.current || 1
  data.pageSize = parameter.pageSize || 20
  !data.records && (data.records = [])
  !data.total && (data.total = data.records.length)
  return data
}

export function transform (parameter) {
  return {
    page: parameter.current || 1,
    page_size: parameter.pageSize || 20,
  }
}
