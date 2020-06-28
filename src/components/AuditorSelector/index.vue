<template>
  <a-select placeholder="请选择审核人" :value="value" :options="auditors" @change="triggerChange"></a-select>
</template>

<script>
import { queryApprovalUser } from '@/api/users'
export default {
  props: {
    value: {
      type: [Number, String],
      default: undefined
    }
  },
  data () {
    return {
      auditors: []
    }
  },
  mounted () {
    queryApprovalUser().then((result) => {
      this.auditors = result
    })
  },
  methods: {
    triggerChange (v) {
      this.$emit('change', v)
    }
  }
}
</script>

<style>

</style>
