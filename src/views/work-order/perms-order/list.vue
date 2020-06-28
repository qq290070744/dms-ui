<script>
import { Modal } from 'ant-design-vue'
const statusMap = [
  ['待审核', '#2db7f5'],
  ['已驳回', '#ff6666'],
  ['已通过', '#00c024'],
]
const type = ['', 'MySql', 'Redis', 'MongoDb', 'PolarDB']
export default {
  components: {},
  props: {
    dataSource: {
      type: [Array, Function],
      default () {
        return []
      }
    },
    readOnly: {
      type: Boolean,
      default: false
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
        title: '主机',
        dataIndex: 'host',
        width: 200,
        customRender: (v, record) => {
          return <span>{v}({record.name})</span>
        }
      },
      {
        title: '实例类型',
        dataIndex: 'type',
        width: 100,
        customRender: (v) => {
          return <span>{type[v]}</span>
        }
      },
      {
        title: '权限申请',
        dataIndex: 'schema',
        customRender: (v, record) => {
          return Array.isArray(v)
            ? <span>
              { v.slice(0, 5).map(info => <a-tag size="medium">{info.db_name}/{info.tb_name}</a-tag>) }
              { v.length > 5 ? <a-button type="primary" size="small" onClick={() => this.showAllSchema(v)}>查看所有</a-button> : ''}
            </span>
            : '-'
        }
      },
      {
        title: '申请天数',
        dataIndex: 'expired_day',
        width: 100,
        customRender: (v) => {
          return <span>{v}天</span>
        }
      },
      {
        title: '申请原因',
        dataIndex: 'reason',
        width: 250,
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: 80,
        customRender: (v) => {
          const [text, color] = statusMap[v - 1] || []
          return <a-tag color={color}>{text}</a-tag>
        }
      },
      {
        title: '申请人',
        dataIndex: 'applicant',
        width: 100
      },
      {
        title: '审核人',
        dataIndex: 'auditor',
        width: 100
      },
      {
        title: '创建时间',
        dataIndex: 'created_time',
        width: 180,
        customRender: (v) => {
          return v.replace('T', ' ').slice(0, 19)
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
  mounted () {
    if (this.$scopedSlots.operation) {
      this.columns.push({
        title: '操作',
        width: 200,
        customRender: (text, record, index) => {
          return <span>
            { this.$scopedSlots.operation && this.$scopedSlots.operation(record) }
          </span>
        }
      })
    }
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
    showAllSchema (schemas) {
      Modal.info({
        content: () => {
          return schemas.map(info => <a-tag size="medium">{info.db_name}/{info.tb_name}</a-tag>)
        },
        icon: () => '',
        title: '所有库表申请列表(待优化)',
        width: '60vw'
      })
    }
  },
  render () {
    return (
      <div>
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

<style scoped>
.filter-area {
  margin-bottom: 10px;
}
.ant-tag {
  margin: 4px;
}
</style>
