<template>
  <a-form-model :model="myForm" layout="inline">
    <a-form-model-item label="类型">
      <a-select v-model="myForm.type" placeholder="请选择类型" allow-clear>
        <a-select-option v-for="item in instanceType" :key="item.value" :value="item.value">
          {{ item.label }}
        </a-select-option>
      </a-select>
    </a-form-model-item>
    <a-form-model-item label="名称">
      <a-input v-model="myForm.name" placeholder="请输入名称" allow-clear />
    </a-form-model-item>
    <a-form-model-item>
      <a-button type="primary" @click="handleSearch">搜索</a-button>
    </a-form-model-item>
  </a-form-model>
</template>

<script>
import { DMS_INSTANCE_TYPE } from '@/utils/const'

export default {
  data() {
    return {
      instanceType: DMS_INSTANCE_TYPE.$items,
      myForm: {
        type: '',
        name: ''
      }
    }
  },
  methods: {
    handleSearch() {
      this.$emit('searchForm', this.myForm)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
