<template>
  <a-select placeholder="请选择审核人" :value="value" :options="auditors" @change="triggerChange"></a-select>
</template>

<script>
import { queryApprovalUser } from '@/api/users'
export default {
  name: 'XAuditorSelector',
  props: {
    value: {
      type: [Number, String],
      default: undefined
    },
    backup: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      auditors: []
    }
  },
  mounted () {
    queryApprovalUser(this.backup).then((result) => {
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
