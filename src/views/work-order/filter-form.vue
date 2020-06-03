<template>
  <a-form-model layout="inline" :model="formData">
    <a-form-model-item label="工单类型">
      <a-select v-model="formData.type" :options="orderTypeOptions" placeholder="请选择工单类型"/>
    </a-form-model-item>
    <a-form-model-item label="工单状态">
      <a-select v-model="formData.status" :options="orderStatusOptions" placeholder="请选择工单状态"/>
    </a-form-model-item>
    <a-form-model-item>
      <a-button type="primary" @click="handleSearch">搜索</a-button>
      <a-button type="primary" @click="handleReset" :disabled="!dirty">重置</a-button>
    </a-form-model-item>
  </a-form-model>
</template>

<script>
import { orderTypeOptions, orderStatusOptions } from './utils'
export default {
  data () {
    return {
      orderTypeOptions,
      orderStatusOptions,
      formData: {
        type: null,
        status: null
      }
    }
  },
  computed: {
    dirty () {
      const fd = this.formData
      return Object.keys(fd).findIndex(k => fd[k] !== null) > -1
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
