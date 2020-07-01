<template>
  <a-form-model layout="inline" :model="formData">
    <a-form-model-item label="工单状态">
      <a-select v-model="formData.status" :options="statusOptions" placeholder="请选择工单状态"/>
    </a-form-model-item>
    <a-form-model-item label="审核人">
      <a-auto-complete placeholder="请输入审核人或选择自己" :dataSource="[nickname]" v-model="formData.auditor"></a-auto-complete>
    </a-form-model-item>
    <a-form-model-item label="申请人">
      <a-auto-complete placeholder="请输入申请人或选择自己" :dataSource="[nickname]" v-model="formData.applicant"></a-auto-complete>
    </a-form-model-item>
    <a-form-model-item>
      <a-button type="primary" @click="handleSearch">搜索</a-button>
      <a-button type="primary" @click="handleReset" :disabled="!dirty">重置</a-button>
    </a-form-model-item>
  </a-form-model>
</template>

<script>
import { statusOptions } from './utils'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      statusOptions,
      formData: {
        type: undefined,
        applicant: undefined,
        auditor: undefined
      }
    }
  },
  computed: {
    ...(mapGetters(['nickname'])),
    dirty () {
      const fd = this.formData
      return Object.keys(fd).findIndex(k => fd[k] !== undefined) > -1
    }
  },
  methods: {
    handleSearch () {
      this.$emit('filter', this.formData)
    },
    handleReset () {
      this.formData = this.$options.data().formData
      this.$emit('filter', {})
    }
  }
}
</script>

<style>

</style>
