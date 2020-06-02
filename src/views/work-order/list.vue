<script>
import { orderType } from './utils'
import WorkOrderDetail from './detail'
import FilterForm from './filter-form'
import StatusTag from './status-tag'
export default {
  components: {
    WorkOrderDetail,
    FilterForm,
    StatusTag
  },
  props: {
    dataSource: {
      type: [Array, Function],
      default () {
        return []
      }
    }
  },
  data () {
    const columns = [
      {
        title: '#',
        width: 60,
        customRender: (_text, _record, index) => {
          return <span>{ index + 1 }</span>
        }
      },
      {
        title: '类型',
        dataIndex: 'type',
        customRender: (text) => {
          return orderType[text]
        }
      },
      {
        title: '数据库名',
        dataIndex: 'data_base',
      },
      {
        title: '数据库机器源',
        dataIndex: 'inst_name',
      },
      {
        title: '状态',
        dataIndex: 'status',
        customRender: (status, record, index) => {
          return <status-tag status={status} />
        }
      },
      {
        title: '备注',
        dataIndex: 'text',
      },
      {
        title: '审核人',
        dataIndex: 'assigned',
      },
      {
        title: '创建人',
        dataIndex: 'username',
      },
      {
        title: '创建时间',
        dataIndex: 'created_time',
      },
      {
        title: '操作',
        width: 200,
        customRender: (text, record, index) => {
          return <a onClick={() => { this.currOrder = record }}>详情</a>
        }
      }
    ]
    return {
      innerSource: null,
      currOrder: null,
      loading: false,
      pagination: {},
      columns,
    }
  },
  computed: {
    finalDataSource () {
      return Array.isArray(this.dataSource) ? this.dataSource : this.innerSource
    }
  },
  created () {
    this.getSource()
  },
  methods: {
    getSource (parameters = {}) {
      if (typeof this.dataSource === 'function') {
        parameters = { ...this.pagination, ...parameters }
        this.loading = true
        this.dataSource(parameters).then((result) => {
          this.loading = false
          const { records, current, pageSize, total } = result
          this.pagination = { current, pageSize, total }
          this.innerSource = records
        })
      }
    },
    onTableChange ({ current }) {
      this.pagination.current = current
      this.getSource()
    },
    onCloseWO () {
      this.currOrder = null
      this.getSource()
    }
  },
  render () {
    return (
      <div>
        <work-order-detail
          dataSource={this.currOrder} onClose={ this.onCloseWO }
        />
        <filter-form onFilter={ this.getSource }/>
        <a-table
          rowKey="id"
          loading={this.loading}
          dataSource={this.finalDataSource}
          pagination={this.pagination}
          columns={this.columns}
          onChange={this.onTableChange}
        />
      </div>
    )
  }
}
</script>

<style>

</style>
