<template>
  <div class="ddl-ocs" v-show="isValidDDL">
    <a-divider />
    <h3> DDL OCS </h3>
    <a-table v-if="isValidDDL" v-bind="table"/>
  </div>
</template>

<script>
import { getDDLOsc, operateOsc } from '@/api/work-order'
import { DMS_MODIFY_ORDER_STATUS, DMS_ORDER_TYPE } from '@/utils/const'

const MYSQL_DDL_TYPE = DMS_ORDER_TYPE['MySQL-DDL']
export default {
  props: {
    order: {
      type: Object,
      default: null
    }
  },
  data () {
    const columns = [
      { title: 'sql语句', dataIndex: 'COMMAND', width: 150 },
      { title: '数据库名', dataIndex: 'DBNAME' },
      { title: '信息', dataIndex: 'INFOMATION', width: 150 },
      {
        title: '进度',
        dataIndex: 'PERCENT',
        width: 120,
        customRender: (percent) => {
          return <a-progress percent={Number(percent)} />
        }
      },
      { title: '剩余执行时间', dataIndex: 'REMAINTIME' },
      { title: 'SQLSHA1', dataIndex: 'SQLSHA1', width: 100 },
      { title: '表名', dataIndex: 'TABLENAME' },
      {
        title: '状态',
        dataIndex: 'is_pause',
        width: 80,
        customRender: (pause) => {
          return Number(pause)
            ? <a-tag color="#ffda31"> 暂停中 </a-tag>
            : <a-tag color="#2db7f5"> 执行中 </a-tag>
        }
      },
      {
        title: '操作',
        width: 100,
        customRender: (_p, record) => {
          const kw = Number(record.is_pause) ? '恢复执行' : '暂停'
          return <span>
            <a-popconfirm
              title={`是否${kw}该进程？`}
              onConfirm={ () => this.toggle(record) }
            >
              <a href="#">{kw}</a>
            </a-popconfirm>
            <a-popconfirm
              title="是否终止该进程？"
              onConfirm={ () => this.operate(record, 'kill') }
            >
              <a href="#">终止</a>
            </a-popconfirm>
          </span>
        }
      }
    ]
    return {
      table: {
        dataSource: [],
        rowKey: 'SQLSHA1',
        columns
      }
    }
  },
  computed: {
    isValidDDL () {
      return this.order &&
        this.order.type === MYSQL_DDL_TYPE &&
        this.order.status === DMS_MODIFY_ORDER_STATUS.IN_PROGRESS
    }
  },
  watch: {
    order: {
      immediate: true,
      handler () {
        if (this.isValidDDL) {
          this.getOsc()
        }
      }
    }
  },
  methods: {
    getOsc () {
      getDDLOsc(this.order.work_id).then((result) => {
        this.table.dataSource = result
      })
    },
    operate (ocs, action = 'kill') {
      operateOsc(ocs.SQLSHA1, action).then(() => {
        setTimeout(this.getOsc, 200)
      })
    },
    toggle (ocs) {
      const action = Number(ocs.is_pause) ? 'resume' : 'pause'
      this.operate(ocs, action)
    }
  }
}
</script>

<style>

</style>
