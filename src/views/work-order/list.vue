<script>
import { orderType, orderStatus } from './utils'
import WorkOrderDetail from './detail'
export default {
  components: {
    WorkOrderDetail
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
        dataIndex: 'source',
      },
      {
        title: '状态',
        dataIndex: 'status',
        customRender: (text, record, index) => {
          return <span>{orderStatus[text]}</span>
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
        parameters = { type: 2, ...this.pagination, ...parameters }

        this.dataSource(parameters).then((result) => {
          const { records, ...pagination } = result
          this.pagination = pagination
          this.innerSource = records
        })
      }
    }
  },
  render () {
    return (
      <div>
        <work-order-detail onExecuted={ () => { this.getSource() } } dataSource={this.currOrder} onClose={() => { this.currOrder = null }}/>
        <a-table
          rowKey="id"
          dataSource={this.finalDataSource}
          columns={this.columns}
        />
      </div>
    )
  }
}
</script>

<style>

</style>
