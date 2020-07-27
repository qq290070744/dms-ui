<script>
import { Modal } from 'ant-design-vue'
import { types, statusMap } from './utils'
import FilterForm from './filter'
export default {
  components: {
    FilterForm
  },
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
          return <span>{types[v]}</span>
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
      filterForm: {},
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
    onFilter (p) {
      this.filterForm = p
      this.getSource({ ...p, current: 1 })
    },
    getSource (parameters = {}) {
      if (typeof this.dataSource === 'function') {
        const { current = 1, pageSize = 10 } = this.pagination
        parameters = { current, pageSize, ...this.filterForm, ...parameters }
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
      const tree = Object.values(
        schemas
          .reduce((result, { db_name: db, tb_name: tb }) => {
            if (!result[db]) {
              result[db] = {
                key: db,
                title: db,
                children: []
              }
            }
            result[db].children.push({ key: db + '@@' + tb, title: tb })
            return result
          }, {})
      )
      const modal = Modal.info({
        content: () => {
          return <a-directory-tree treeData={tree}/>
        },
        icon: () => '',
        title: '所有库表申请列表',
        width: '60vw',
        onOk: () => {
          modal.destroy()
        }
      })
    }
  },
  render () {
    return (
      <div>
        <filter-form onFilter={this.onFilter}/>
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
