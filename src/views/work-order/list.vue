<script>
import { orderType, FINISHED_WO } from './utils'
import WorkOrderDetail from './detail'
import FilterForm from './filter-form'
import StatusTag from './status-tag'

import RollbackAction from './rollback-action'
import WorkOrderForm from '@/views/query/mysql/work-order-action/form'
import { isMysqlType } from '../query/utils'

export default {
  components: {
    WorkOrderDetail,
    FilterForm,
    StatusTag,
    WorkOrderForm,
    RollbackAction
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
        width: 300,
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
          return <span>
            <a class="ys-modal-trigger" onClick={() => { this.currOrder = record }}>详情</a>
            {
              this.canRollback(record) &&
              <rollback-action onSuccess={this.onRollbacked} workId={record.work_id} scopedSlots={{
                default: ({ register, sql, exParams }) => <work-order-form sql={sql} register={register} exParams={ exParams } />
              }} />
            }
            { this.$scopedSlots.operation && this.$scopedSlots.operation(record) }
          </span>
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
  methods: {
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
    onFilter (p) {
      this.filterForm = p
      this.getSource({ ...p, current: 1 })
    },
    onTableChange ({ current }) {
      this.pagination.current = current
      this.getSource()
    },
    onCloseWO () {
      this.currOrder = null
      this.getSource()
    },
    canRollback (record) {
      return isMysqlType(record.type) && record.status === FINISHED_WO
    },
    onRollbacked () {
      this.getSource()
    },
    genKey () {
      return this.currOrder ? this.currOrder.id : 0
    }
  },
  render () {
    return (
      <div>
        <work-order-detail
          key={this.genKey()}
          dataSource={this.currOrder} onClose={ this.onCloseWO } readOnly={ this.readOnly }
        />
        <filter-form class="filter-area" onFilter={this.onFilter}/>
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
</style>
