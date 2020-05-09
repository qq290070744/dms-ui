<template>
  <a-form v-bind="formOption">
    <a-form-item label="工单内容(命令)">
      <div class="commands">{{ commands }}</div>
    </a-form-item>
    <a-form-item label="审核人">
      <a-select
        v-decorator="[
          'auditor_id',
          { rules: [{ required: true, message: '用户名不能为空' }] },
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
export default {
  props: {
    actionObject: {
      type: Object,
      default: null
    },
    auditors: {
      type: Array,
      default () { return [] }
    }
  },
  created () {
    this.formOption.form = this.$form.createForm(this)
  },
  data () {
    return {
      loading: false,
      formOption: {
        form: null,
        labelCol: { span: 6 },
        wrapperCol: { span: 18 },
      }
    }
  },
  computed: {
    commands () {
      const commands = this.actionObject && this.actionObject.commands
      return commands ? commands.join('\n') : ''
    }
  },
  methods: {
    submit () {
      return new Promise((resolve, reject) => {
        this.formOption.form.validateFields((err, values) => {
          if (!err) {
            values.actions = JSON.stringify(this.actionObject.actions)
            resolve(values)
          } else {
            reject(err)
          }
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
.commands {
  white-space: pre;
  line-height: 1.5;
}
</style>
