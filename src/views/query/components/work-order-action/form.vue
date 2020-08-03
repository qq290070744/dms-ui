<template>
  <a-form v-bind="formOption">
    <a-form-item label="工单内容(命令)">
      <monaco-editor :value="sql" ref="editor" readOnly language="mysql"></monaco-editor>
    </a-form-item>
    <a-form-item label="审核人">
      <x-auditor-selector
        v-decorator="[
          'auditor_id',
          { rules: [{ required: true, message: '审核人不能为空' }] }
        ]"
      />
    </a-form-item>
    <a-form-item label="工单说明">
      <a-textarea
        v-decorator="[
          'remark',
          { rules: [{ required: true, message: '工单说明不能为空' }] },
        ]"
      ></a-textarea>
    </a-form-item>
  </a-form>
</template>

<script>
import MonacoEditor from '@/components/monaco-editor'

export default {
  components: {
    MonacoEditor
  },
  props: {
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
      this.register(this.formOption.form)
    }
  },
  data () {
    return {
      loading: false,
      formOption: {
        form: null,
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
      }
    }
  },
}
</script>

<style scoped>
.ant-btn {
  margin-left: 100px;
}
</style>
