<template>
  <a-form v-bind="formOption" :form="form">
    <a-form-item label="名称">
      <a-input
        v-decorator="[
          'name',
          { initialValue: initial.name, rules: [{ required: true, message: '名称不能为空' }] },
        ]"
      ></a-input>
    </a-form-item>
    <a-form-item v-if="mysql" label="用户名">
      <a-input
        v-decorator="[
          'username',
          { initialValue: initial.username, rules: [{ required: true, message: '用户名不能为空' }] },
        ]"
      ></a-input>
    </a-form-item>
    <a-form-item label="密码">
      <a-input-password
        autocomplete="new-password"
        v-decorator="[
          'password',
          { initialValue: initial.password }
        ]"
      ></a-input-password>
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
  </a-form>
</template>

<script>
export default {
  props: {
    initial: {
      default () { return {} },
      type: Object
    },
    mysql: {
      default: false,
      type: Boolean
    },
    form: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      formOption: {
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
      }
    }
  }
}
</script>

<style scoped>
.ant-btn {
  margin-left: 100px;
}
</style>
