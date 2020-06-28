<template>
  <basic-container class="my-review-list">

    <a-modal :visible="showModal" @cancel="showModal = false" @ok="changeAuditor">
      <a-form v-bind="formOption">
        <a-form-item label="审核人">
          <a-select
            v-decorator="[
              'auditor_id',
              { rules: [{ required: true, message: '审核人不能为空' }] },
            ]"
            placeholder="请选择审核人"
            :options="auditors"
          ></a-select>
        </a-form-item>
      </a-form>
    </a-modal>

    <work-order-list :dataSource="dataSource" :readOnly="true">
      <template #operation="record">
        <a class="ys-modal-trigger" v-if="record.status === PENDING_WO" @click="() => showChangeAuditor(record)">更换审核人</a>
        <a class="ys-modal-trigger" v-if="record.status === PENDING_WO" @click="() => urge(record)">催一催</a>
        <a-popconfirm v-if="record.status === PENDING_WO" title="是否撤销该工单？" @confirm="() => cancelOrder(record)">
          <a class="ys-modal-trigger cancel-work-order">撤销</a>
        </a-popconfirm>
      </template>
    </work-order-list>
  </basic-container>
</template>

<script>
import { mySubmitWorkOrder, changeAuditor, cancelWorkOrder, urge } from '@/api/work-order'
import WorkOrderList from '../list'
import { queryApprovalUser } from '@/api/users'
import { PENDING_WO } from '../utils'
export default {
  components: {
    WorkOrderList,
  },
  data () {
    return {
      auditors: [],
      formOption: {
        form: null,
        labelCol: { span: 4 },
        wrapperCol: { span: 16 },
      },
      record: null,
      showModal: false,
      PENDING_WO,
    }
  },
  created () {
    this.formOption.form = this.$form.createForm(this)
  },
  methods: {
    dataSource (params) {
      return mySubmitWorkOrder(params)
    },
    showChangeAuditor (record) {
      this.record = record
      queryApprovalUser().then((result) => {
        this.auditors = result
      })
      this.showModal = true
    },
    changeAuditor () {
      this.formOption.form.validateFields((err, values) => {
        if (!err) {
          changeAuditor({ work_id: this.record.work_id, ...values }).then((result) => {
            this.record.auditor_id = result.auditor_id
            this.record.assigned = result.assigned
            this.showModal = false
            this.record = null
            this.$message.success('更换审核人成功')
          })
        }
      })
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
