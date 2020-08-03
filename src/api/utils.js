const defaultPagination = {
  current: 1,
  pageSize: 10
}

export function transformAfter (data, { page: current, page_size: pageSize }) {
  data = {
    ...defaultPagination,
    current,
    pageSize,
    ...data
  }

  !data.records && (data.records = [])
  !data.total && (data.total = data.records.length)
  data.total = Number(data.total)
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

export function isPaginationApi (config) {
  return config && config.xPagination === true
}

export function transformPaginationRequest (config) {
  if (isPaginationApi(config)) {
    config.params = transform(config.params)
  }

  return config
}

export function transformPaginationResponse (config, data) {
  return isPaginationApi(config) ? transformAfter(data, config.params) : data
}
