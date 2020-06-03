<template>
  <a-form v-bind="formOption">
    <a-form-item label="工单内容(命令)">
      <monaco-editor :value="sql" ref="editor" readOnly language="mysql"></monaco-editor>
    </a-form-item>
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
    <a-form-item label="工单说明">
      <a-textarea
        v-decorator="[
          'remark'
        ]"
      ></a-textarea>
    </a-form-item>
  </a-form>
</template>

<script>
import MonacoEditor from '@/components/monaco-editor'
import { queryApprovalUser } from '@/api/users'
import { createWorkOrder } from '@/api/work-order'

export default {
  components: {
    MonacoEditor
  },
  props: {
    exParams: {
      type: Object,
      default: null
    },
    register: {
      type: Function,
      default: null
    },
    sql: {
      type: String,
      default: ''
    }
  },
  created () {
    this.formOption.form = this.$form.createForm(this)
    if (this.register) {
      this.register(this)
    }
  },
  data () {
    return {
      loading: false,
      formOption: {
        form: null,
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
      },
      auditors: []
    }
  },
  mounted () {
    queryApprovalUser().then((result) => {
      this.auditors = result
    })
  },
  methods: {
    submit () {
      return new Promise((resolve, reject) => {
        this.formOption.form.validateFields((err, values) => {
          if (err) {
            reject(err)
          }
          values.sql = this.sql
          resolve(createWorkOrder({ ...values, ...this.exParams }))
        })
      })
    }
  }
}
</script>

<style scoped>
.ant-btn {
  margin-left: 100px;
}
.commands-wrapper {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 4px;
  box-sizing: border-box;
}
.commands-content {
  height: 300px;
}
</style>
