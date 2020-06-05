<template>
  <a-modal title="工单详情" @cancel="close" :visible="showDrawer" :width="'60vw'" :footer="null">
    <div class="ant-descriptions">
      <h3 class="ant-descriptions-title">执行命令</h3>
      <monaco-editor :key="uid" :readOnly="true" :value="sql" :language="language"></monaco-editor>
    </div>

    <a-divider />

    <a-descriptions title="主要信息" :bordered="true" size="small">
      <a-descriptions-item label="创建人">
        {{ workOrder.username }}
      </a-descriptions-item>
      <a-descriptions-item label="审核人">
        {{ workOrder.assigned }}
      </a-descriptions-item>
      <a-descriptions-item label="类型">
        {{ orderType[workOrder.type] }}
      </a-descriptions-item>
      <a-descriptions-item label="数据库名">
        {{ workOrder.data_base }}
      </a-descriptions-item>
      <a-descriptions-item label="机器实例名称">
        {{ workOrder.inst_name }}
      </a-descriptions-item>
      <a-descriptions-item label="状态">
        {{ orderStatus[workOrder.status] }}
        <a @click="reload" v-if="isExecuting">刷新</a>
      </a-descriptions-item>
      <a-descriptions-item :span="3" v-if="workOrder.rejected" label="驳回信息">
        {{ workOrder.rejected }}
      </a-descriptions-item>
      <a-descriptions-item :span="3" label="备注">
        {{ workOrder.text }}
      </a-descriptions-item>
    </a-descriptions>

    <ddl-osc :order="workOrder"></ddl-osc>

    <template v-if="execResult.length">
      <a-divider />
      <h3>sql 执行状态</h3>
      <a-descriptions v-for="row in execResult" :key="row.id" :title="row.sql" :bordered="true" size="small">
        <a-descriptions-item label="状态">
          {{ row.state }}
        </a-descriptions-item>
        <a-descriptions-item label="影响行数">
          {{ row.affectrow }}
        </a-descriptions-item>
        <a-descriptions-item label="错误信息">
          {{ row.error }}
        </a-descriptions-item>
        <a-descriptions-item label="执行时间">
          {{ row.time }}秒
        </a-descriptions-item>
      </a-descriptions>
    </template>

    <a-divider />

    <div v-if="!readOnly && !executed && PENDING_WO === workOrder.status">
      <a-button type="primary" @click="exec">执行命令</a-button>
      <a-button @click="doReject = true">驳回</a-button>
    </div>

    <a-modal :visible="doReject" @ok="submitReject" @cancel="doReject = false">
      <p>填写驳回理由</p>
      <a-textarea v-model="rejectReason"></a-textarea>
    </a-modal>
  </a-modal>
</template>

<script>
import MonacoEditor from '@/components/monaco-editor'
import DdlOsc from './ddl-osc'
import { orderType, orderStatus, PENDING_WO, execType, ORDER_EXECUTING } from './utils'
import { execWorkOrder, queryWorkOrderExection, rejectWorkOrder, getWorkOrder } from '../../api/work-order'
import { parseLanguage } from '../query/utils'
export default {
  components: {
    MonacoEditor,
    DdlOsc
  },
  props: {
    dataSource: {
      type: Object,
      default: null
    },
    readOnly: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      orderType,
      orderStatus,
      PENDING_WO,
      execResult: [],
      executed: false,
      doReject: false,
      rejectReason: '',
      innerDataSource: null,
    }
  },
  computed: {
    workOrder () {
      return this.innerDataSource || this.dataSource || {}
    },
    showDrawer () {
      return !!this.dataSource
    },
    uid () {
      return this.workOrder.id || 0
    },
    sql () {
      try {
        const data = JSON.parse(this.workOrder.sql)
        return data
      } catch (e) {
        return this.workOrder.sql
      }
    },
    isExecuting () {
      return this.workOrder.status === ORDER_EXECUTING
    },
    language () {
      return parseLanguage(this.workOrder.type)
    }
  },
  watch: {
    uid (val) {
      if (val) {
        this.reload()
      }
    }
  },
  methods: {
    close () {
      this.innerDataSource = null
      this.$emit('close')
    },
    queryResult () {
      queryWorkOrderExection(this.workOrder.work_id).then((result) => {
        if (Array.isArray(result)) {
          this.execResult = result
        }
      })
    },
    exec () {
      const { work_id: id, type } = this.workOrder
      execWorkOrder(id, execType[type]).then((result) => {
        if (Array.isArray(result)) {
          this.execResult = result
        }
        this.reload()
        this.executed = true
      }, (result) => {
        this.reload()
        this.executed = true
      })
    },
    reload () {
      getWorkOrder(this.workOrder.work_id).then((result) => {
        this.innerDataSource = result[0] || result
      })
      this.queryResult()
    },
    submitReject () {
      rejectWorkOrder(this.workOrder.work_id, this.rejectReason).then(() => {
        this.$message.success('驳回成功')
        this.$emit('executed')
        this.doReject = false
        this.close()
      })
    }
  }
}
</script>

<style scoped>
.ant-descriptions {
  margin-bottom: 10px;
}
.ant-btn {
  margin-right: 8px;
}
</style>
