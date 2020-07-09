<template>
  <a-modal title="工单详情" @cancel="close" :visible="showDrawer" :width="'80vw'" :footer="null">
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
      <h3>sql 执行状态 - (总共{{ execResult.length }}条)</h3>
      <a-table
        :columns="execResultColumns"
        :dataSource="execResult"
        rowKey="id"
        :bordered="true"
        size="small"
      />
    </template>

    <a-divider />

    <div v-if="!readOnly && !executed && PENDING_WO === workOrder.status">
      <a-button type="primary" @click="exec">执行命令</a-button>
      <a-button @click="doReject = true" type="danger">驳回</a-button>
    </div>

    <a-modal :visible="doReject" @ok="submitReject" @cancel="doReject = false">
      <p>填写驳回理由</p>
      <a-textarea v-model="rejectReason"></a-textarea>
    </a-modal>
  </a-modal>
</template>

<script>
import MonacoEditor from '@/components/monaco-editor'
import { Modal } from 'ant-design-vue'
import DdlOsc from './ddl-osc'
import { execWorkOrder, queryWorkOrderExection, rejectWorkOrder, getWorkOrder } from '@/api/work-order'
import { DMS_MODIFY_ORDER_STATUS, DMS_ORDER_TYPE, dmsBaseOrderType } from '@/utils/const'
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
      orderType: DMS_ORDER_TYPE.$label,
      orderStatus: DMS_MODIFY_ORDER_STATUS.$label,
      PENDING_WO: DMS_MODIFY_ORDER_STATUS.CHECK_PENDING,
      execResult: [],
      executed: false,
      doReject: false,
      rejectReason: '',
      innerDataSource: null,
      execResultColumns: [
        {
          dataIndex: 'sql',
          title: 'SQL',
          width: 300,
          customRender: this.rContent
        },
        { dataIndex: 'state', title: '状态', width: 80 },
        { dataIndex: 'affectrow', title: '影响行数', width: 80 },
        {
          dataIndex: 'error',
          title: '错误信息',
          width: 200,
          customRender: this.rContent,
          filters: [{ text: '只看有内容的', value: 'content' }],
          onFilter: (value, { error }) => value && error,
        },
        { dataIndex: 'time', title: '执行时间', width: 80, customRender: (v) => <span>{v}秒</span> },
      ]
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
      return this.workOrder.status === DMS_MODIFY_ORDER_STATUS.IN_PROGRESS
    },
    language () {
      return dmsBaseOrderType(this.workOrder.type)
    }
  },
  watch: {
    uid: {
      immediate: true,
      handler (val) {
        if (val) {
          this.reload()
        }
      }
    }
  },
  methods: {
    close () {
      this.innerDataSource = null
      this.$emit('close')
    },
    queryResult () {
      queryWorkOrderExection(this.workOrder.work_id)
        .then((result) => {
          if (Array.isArray(result)) {
            this.execResult = result
          }
        })
    },
    exec () {
      const { work_id: id, type } = this.workOrder
      execWorkOrder(id, dmsBaseOrderType(type))
        .then((result) => {
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
    },
    rContent (text) {
      if (text.length > 350) {
        return <span>
          {text.slice(0, 300)}...
          <a-button type="link" onClick={() => this.showFull(text)}>查看完整</a-button>
        </span>
      } else {
        return text
      }
    },
    showFull (text) {
      Modal.info({
        icon: () => '',
        content: <p style="white-space: pre-line">{text}</p>,
        width: '50vw'
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
