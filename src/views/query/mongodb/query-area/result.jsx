let uid = 0
const trans = {
  Array (data) {
    return data.map((d, i) => trans.entry(d, i))
  },
  Object (data) {
    return Object.keys(data).map((k) => trans.entry(data[k], k))
  },
  entry (value, prop = '') {
    const type = Object.prototype.toString.call(value).slice(8, -1)
    if (trans[type]) {
      return { children: trans[type](value), prop, type, key: uid++ }
    } else {
      value = String(value)
      return { value, prop, type, key: uid++ }
    }
  }
}
export default {
  props: {
    result: {
      default: () => [],
      type: Array
    }
  },
  data () {
    return {
      pagination: {
        current: 1,
        pageSize: 10,
        position: 'top',
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '40']
      },
      columns: [
        { dataIndex: 'prop', title: '属性' },
        { dataIndex: 'type', title: '类型' },
        { dataIndex: 'value', title: '值' },
      ],
      dataSource: [],
      expandedRowKeys: [],
      scroll: { y: 400 },
    }
  },
  watch: {
    result () {
      uid = 0
      this.setData()
    }
  },
  methods: {
    change (pagination) {
      this.pagination = { ...this.pagination, ...pagination }
      this.setData()
    },
    setData () {
      const { current, pageSize } = this.pagination
      this.dataSource = this.result
        .slice((current - 1) * pageSize, current * pageSize)
        .map(data => trans.entry(data))
      this.$nextTick(() => {
        this.expandedRowKeys = this.dataSource.map(d => d.key)
      })
    },
    expandedRowsChange (keys) {
      this.expandedRowKeys = keys
    }
  },
  render () {
    const props = { ...this.$data, size: 'small', bordered: true }
    return <a-table
      props={props}
      onChange={this.change}
      onExpandedRowsChange={this.expandedRowsChange}
    />
  }
}
