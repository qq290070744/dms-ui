<template>
  <a-form-model layout="inline" :model="formData">
    <a-form-model-item label="只看我相关">
      <a-checkbox v-model="formData.only_mine"/>
    </a-form-model-item>
    <a-form-model-item label="工单类型">
      <a-select v-model="formData.type" :options="orderTypeOptions" placeholder="请选择工单类型" allowClear/>
    </a-form-model-item>
    <a-form-model-item label="工单状态">
      <a-select v-model="formData.status" :options="orderStatusOptions" placeholder="请选择工单状态" allowClear/>
    </a-form-model-item>
    <a-form-model-item label="数据库名">
      <a-input v-model="formData.db_name"/>
    </a-form-model-item>
    <a-form-model-item label="时间范围">
      <a-range-picker v-model="formData.range" show-time format="YYYY-MM-DD HH:mm:ss" allowClear/>
    </a-form-model-item>
    <a-form-model-item>
      <a-button type="primary" @click="handleSearch">搜索</a-button>
      <a-button type="primary" @click="handleReset" :disabled="!dirty">重置</a-button>
    </a-form-model-item>
  </a-form-model>
</template>

<script>
import { DMS_ORDER_TYPE, DMS_MODIFY_ORDER_STATUS } from '@/utils/const'
export default {
  data () {
    return {
      orderTypeOptions: DMS_ORDER_TYPE.$items,
      orderStatusOptions: DMS_MODIFY_ORDER_STATUS.$items,
      formData: {
        type: undefined,
        status: undefined,
        range: undefined,
        only_mine: true
      }
    }
  },
  computed: {
    dirty () {
      const fd = this.formData
      return Object.keys(fd).findIndex(k => fd[k] !== undefined) > -1
    }
  },
  methods: {
    parseForm () {
      const { range, ...rest } = this.formData
      const [start_date, end_date] = (range || []).map((m) => m.format('YYYY-MM-DD HH:mm:ss'))
      return {
        start_date,
        end_date,
        ...rest
      }
    },
    handleSearch () {
      this.$emit('filter', this.parseForm())
    },
    handleReset () {
      this.formData = this.$options.data().formData
      this.handleSearch()
    }
  }
}
</script>

<style>

</style>
