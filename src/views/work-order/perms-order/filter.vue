<template>
  <a-form-model layout="inline" :model="formData">
    <a-form-model-item label="工单状态">
      <a-select v-model="formData.status" :options="statusOptions" placeholder="请选择工单状态" allowClear/>
    </a-form-model-item>
    <a-form-model-item label="审核人" v-if="!auditor">
      <a-auto-complete placeholder="请输入审核人或选择自己" :dataSource="[nickname]" v-model="formData.auditor" allowClear></a-auto-complete>
    </a-form-model-item>
    <a-form-model-item label="申请人" v-else>
      <a-auto-complete placeholder="请输入申请人或选择自己" :dataSource="[nickname]" v-model="formData.applicant" allowClear></a-auto-complete>
    </a-form-model-item>
    <a-form-model-item>
      <a-button type="primary" @click="handleSearch">搜索</a-button>
      <a-button type="primary" @click="handleReset" :disabled="!dirty">重置</a-button>
    </a-form-model-item>
  </a-form-model>
</template>

<script>
import { DMS_PERMS_ORDER_TYPE } from '@/utils/const'
import { mapGetters } from 'vuex'
export default {
  props: {
    auditor: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      statusOptions: DMS_PERMS_ORDER_TYPE.$items,
      formData: {
        status: DMS_PERMS_ORDER_TYPE.CHECK_PENDING,
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
      this.$emit('filter', this.formData)
    }
  }
}
</script>

<style>

</style>
