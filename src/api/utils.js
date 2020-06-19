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
  const { current, pageSize, ...rest } = parameter
  return {
    page: current || defaultPagination.current,
    page_size: pageSize || defaultPagination.pageSize,
    ...rest
  }
}
