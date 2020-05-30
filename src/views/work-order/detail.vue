<template>
  <a-drawer title="工单详情" @close="close" placement="left" :visible="showDrawer" width="600">
    <div class="ant-descriptions">
      <h3 class="ant-descriptions-title">执行命令</h3>
      <monaco-editor :key="uid" :readOnly="true" :value="sql"></monaco-editor>
    </div>
    <a-descriptions title="主要信息">
      <a-descriptions-item label="创建人">
        {{ workOrder.username }}
      </a-descriptions-item>
      <a-descriptions-item label="类型">
        {{ orderType[workOrder.type] }}
      </a-descriptions-item>
      <a-descriptions-item label="数据库名">
        {{ workOrder.data_base }}
      </a-descriptions-item>
      <a-descriptions-item label="数据库机器源">
        {{ workOrder.source }}
      </a-descriptions-item>
      <a-descriptions-item label="状态">
        {{ orderStatus[workOrder.status] }}
      </a-descriptions-item>
      <a-descriptions-item label="备注">
        {{ workOrder.text }}
      </a-descriptions-item>
    </a-descriptions>
    <template v-if="execResult">
      <a-descriptions :key="row.id" :title="row.sql" v-for="row in execResult">
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
    <a-modal :visible="doReject" @ok="submitReject" @cancel="doReject = false">
      <p>填写驳回理由</p>
      <a-textarea v-model="rejectReason"></a-textarea>
    </a-modal>
    <div v-if="!executed && UNREVIEW_STATUS === workOrder.status">
      <a-button type="primary" @click="exec">执行命令</a-button>
      <a-button @click="doReject = true">驳回</a-button>
    </div>
  </a-drawer>
</template>

<script>
import MonacoEditor from '@/components/monaco-editor'
import { orderType, orderStatus, UNREVIEW_STATUS, HAS_RESULT_STATUS, execType } from './utils'
import { execWorkOrder, queryWorkOrderExection, rejectWorkOrder } from '../../api/work-order'
export default {
  components: {
    MonacoEditor
  },
  props: {
    dataSource: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      orderType,
      orderStatus,
      UNREVIEW_STATUS,
      execResult: [],
      executed: false,
      doReject: false,
      rejectReason: ''
    }
  },
  computed: {
    workOrder () {
      return this.dataSource || {}
    },
    showDrawer () {
      return !!this.dataSource
    },
    uid () {
      return this.workOrder.id
    },
    sql () {
      try {
        const data = JSON.parse(this.workOrder.sql)
        return data
      } catch (e) {
        return this.workOrder.sql
      }
    }
  },
  watch: {
    uid () {
      if (HAS_RESULT_STATUS.includes(this.workOrder.status)) {
        this.queryResult()
      }
    }
  },
  methods: {
    close () {
      this.$emit('close')
    },
    queryResult () {
      queryWorkOrderExection(this.workOrder.work_id).then((result) => {
        this.execResult = result || []
        this.executed = true
      })
    },
    exec () {
      const { work_id: id, type } = this.workOrder
      execWorkOrder(id, execType[type]).then((result) => {
        this.execResult = result || []
        this.executed = true
        this.$emit('executed')
      }, (result) => {
        this.queryResult()
      })
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
