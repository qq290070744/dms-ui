<template>
  <div>
    <a-empty v-if="emptyInstace" description="没有可选 REDIS 实例或者你已有所有实例权限"/>
    <x-result v-else-if="success" @again="reset" v-on="$listeners"></x-result>
    <a-form v-else v-bind="layout" :form="form">
      <a-form-item label="实例">
        <a-select
          v-decorator="['inst_id', {rules: [{ required: true, message: '实例不能为空' }]}]"
          :options="instances"
        ></a-select>
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
import { getInstance } from '@/api/perms'
import { DMS_INSTANCE_TYPE } from '@/utils/const'
import AuditorSelector from '@/components/AuditorSelector'
import XResult from './result'
export default {
  name: 'ApplyRedisPerms',
  components: {
    XResult,
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
      instances: [],
      emptyInstace: false,
      loading: false,
      DMS_INSTANCE_TYPE
    }
  },
  created () {
    this.form = this.$form.createForm(this)
  },
  mounted () {
    this.getInstance()
  },
  methods: {
    getInstance () {
      getInstance({
        type: this.DMS_INSTANCE_TYPE.Redis
      })
        .then((res) => {
          this.instances = res.map(({ id, name }) => ({ label: name, value: id }))
          this.emptyInstace = !this.instances.length
        })
    },
    submit () {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.loading = true
          values.type = this.DMS_INSTANCE_TYPE.Redis
          this.$asyncEmit('submit', values)
            .then(() => {
              this.loading = false
              this.success = true
            })
        }
      })
    },
    reset () {
      this.getInstance()
      this.form.resetFields()
      this.success = false
    }
  }
}
</script>

<style scoped>
.ant-empty {
  margin-top: 200px;
}
</style>
