<template>
  <a-form v-bind="formOption">
    <a-form-item label="名称">
      <a-input
        v-decorator="[
          'name',
          { initialValue: initial.name, rules: [{ required: true, message: '名称不能为空' }] },
        ]"
      ></a-input>
    </a-form-item>
    <a-form-item label="密码">
      <a-input
        v-decorator="[
          'password',
          { initialValue: initial.password }
        ]"
      ></a-input>
    </a-form-item>
    <a-form-item label="主机名">
      <a-input
        v-decorator="[
          'host',
          { initialValue: initial.host, rules: [{ required: true, message: '主机名不能为空' }] },
        ]"
      ></a-input>
    </a-form-item>
    <a-form-item label="端口">
      <a-input-number
        :max="65536"
        :min="0"
        v-decorator="[
          'port',
          { initialValue: initial.port, rules: [{ required: true, message: '端口不能为空' }] },
        ]"
      ></a-input>
      </a-input-number></a-form-item>
    <a-form-item label="备注">
      <a-input
        v-decorator="[
          'remark',
          { initialValue: initial.remark }
        ]"
      ></a-input>
    </a-form-item>
    <a-form-item>
      <a-button type="primary" @click="submit">
        提交
      </a-button>
    </a-form-item>
  </a-form>
</template>

<script>
export default {
  props: {
    send: {
      default: null,
      type: Function
    },
    initial: {
      default () { return {} },
      type: Object
    }
  },
  created () {
    this.formOption.form = this.$form.createForm(this)
  },
  data () {
    return {
      formOption: {
        form: null,
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
      }
    }
  },
  methods: {
    submit () {
      this.formOption.form.validateFields((err, values) => {
        if (!err) {
          this.$asyncEmit('submit', values).then(() => {
            this.formOption.form.resetFields()
          })
        }
      })
    }
  }
}
</script>

<style>

</style>
