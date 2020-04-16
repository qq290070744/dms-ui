const defaultPagination = {
  current: 1,
  pageSize: 10
}

export function genPage (data, parameter) {
  data = {
    ...defaultPagination,
    ...parameter,
    ...data
  }

  !data.records && (data.records = [])
  !data.total && (data.total = data.records.length)
  return data
}

export function transform (parameter) {
  return {
    page: parameter.current || defaultPagination.current,
    page_size: parameter.pageSize || defaultPagination.pageSize,
  }
}
