<template>
  <div>
    <x-result v-if="success" @again="reset" v-on="$listeners"></x-result>
    <a-form v-else v-bind="layout" :form="form">
      <a-form-item label="实例">
        <a-select v-decorator="['inst_id', {rules: [{ required: true, message: '实例不能为空' }]}]" :options="instances" @change="(v) => { instId = v }"></a-select>
      </a-form-item>
      <a-form-item label="库表申请">
        <dbtb-selector :instId="instId" v-decorator="['struct', {rules: [{ required: true, message: '库表不能为空' }]}]" />
      </a-form-item>
      <a-form-item label="审核人">
        <auditor-selector v-decorator="['auditor_id', {rules: [{ required: true, message: '审核人不能为空' }]}]"></auditor-selector>
      </a-form-item>
      <a-form-item label="过期时间">
        <a-select v-decorator="['expired_day', {rules: [{ required: true, message: '过期时间不能为空' }]}]">
          <a-select-option :value="1">一天</a-select-option>
          <a-select-option :value="7">一周</a-select-option>
          <a-select-option :value="30">一个月(30天)</a-select-option>
          <a-select-option :value="60">三个月(60天)</a-select-option>
          <a-select-option :value="180">半年(180天)</a-select-option>
          <a-select-option :value="365">一年(365天)</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="申请原因">
        <a-textarea v-decorator="['reason', {rules: [{ required: true, message: '申请原因不能为空' }]}]"></a-textarea>
      </a-form-item>
      <a-form-item :wrapperCol="{ offset: 4, span: 14 }">
        <a-button type="primary" @click="submit" :loading="loading">提交</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import DbtbSelector from './dbtb-selector'
import { getInstance } from '@/api/perms'
import { INSTANCE_TYPE } from './utils'
import AuditorSelector from '@/components/AuditorSelector'
import XResult from './result'
export default {
  name: 'ApplyMysqlPerms',
  components: {
    XResult,
    DbtbSelector,
    AuditorSelector
  },
  data () {
    return {
      success: false,
      form: null,
      layout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
      },
      instId: 0,
      instances: [],
      loading: false,
      INSTANCE_TYPE
    }
  },
  created () {
    this.form = this.$form.createForm(this)
  },
  mounted () {
    getInstance({
      type: this.INSTANCE_TYPE.MYSQL
    })
      .then((res) => {
        this.instances = res.map(({ id, name, host }) => ({ label: `${host}(${name})`, value: id }))
      })
  },
  methods: {
    submit () {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.loading = true
          values.type = this.INSTANCE_TYPE.MYSQL
          this.$asyncEmit('submit', values)
            .then(() => {
              this.loading = false
              this.success = true
            })
        }
      })
    },
    reset () {
      this.form.resetFields()
      this.success = false
      this.instId = 0
    }
  }
}
</script>

<style>

</style>
