<template>
  <basic-container class="my-review-list">
    <work-order-list :dataSource="dataSource" :readOnly="true">
      <template #operation="record">
        <x-modal
          title="更换审核人"
          :silent="true"
          :onOk="(data) => changeAuditor(data, record)"
          :button="{type: 'link', size: 'small'}"
          v-if="record.status === CHECK_PENDING"
        >
          <template #default="{registerForm}" >
            <x-form :registerForm="registerForm" :fields="fields"></x-form>
          </template>
        </x-modal>
        <a class="ys-modal-trigger" v-if="record.status === CHECK_PENDING" @click="() => urge(record)">催一催</a>
        <a-popconfirm v-if="record.status === CHECK_PENDING" title="是否撤销该工单？" @confirm="() => cancelOrder(record)">
          <a class="ys-modal-trigger cancel-work-order">撤销</a>
        </a-popconfirm>
      </template>
    </work-order-list>
  </basic-container>
</template>

<script>
import { mySubmitWorkOrder, changeAuditor, cancelWorkOrder, urge } from '@/api/work-order'
import WorkOrderList from '../modify-order/list'
import { DMS_MODIFY_ORDER_STATUS } from '@/utils/const'
export default {
  components: {
    WorkOrderList,
  },
  data () {
    return {
      fields: [
        ['auditor_id', '审批人', {
          required: true,
          component: 'XAuditorSelector'
        }],
      ],
      auditors: [],
      formOption: {
        form: null,
        labelCol: { span: 4 },
        wrapperCol: { span: 16 },
      },
      record: null,
      showModal: false,
      CHECK_PENDING: DMS_MODIFY_ORDER_STATUS.CHECK_PENDING,
    }
  },
  methods: {
    dataSource (params) {
      return mySubmitWorkOrder(params)
    },
    changeAuditor (values, record) {
      const promise = changeAuditor({ work_id: record.work_id, ...values })
      promise.then((result) => {
        record.auditor_id = result.auditor_id
        record.assigned = result.assigned
        this.record = null
        this.$message.success('更换审核人成功')
      })
      return promise
    },
    cancelOrder (record) {
      cancelWorkOrder({ work_id: record.work_id }).then((result) => {
        record.status = result.status
        this.$message.success('撤销工单成功')
      })
    },
    urge (record) {
      urge(record.work_id).then(() => {
        this.$message.success('已发送邮件到审核人')
      })
    }
  }
}
</script>

<style scoped>
.cancel-work-order {
  color: #ff6666;
}
</style>
