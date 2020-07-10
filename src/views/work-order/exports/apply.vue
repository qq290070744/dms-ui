<template>
  <x-modal title="申请数据导出" :silent="true" :onOk="create">
    <template #default="{registerForm}" >
      <x-form :registerForm="registerForm" :fields="fields"></x-form>
    </template>
  </x-modal>
</template>

<script>
import { applyExport } from '@/api/export-data'
export default {
  props: {
    extra: {
      type: [Object, Function],
      default: () => ({})
    }
  },
  data () {
    return {
      fields: [
        ['auditor_id', '审批人', {
          required: true,
          component: 'XAuditorSelector'
        }],
        ['reason', '申请原因', {
          required: true,
          component: 'a-textarea'
        }],
      ]
    }
  },
  methods: {
    create (data) {
      const extra = typeof this.extra === 'function' ? this.extra() : this.extra
      const apply = applyExport({ ...data, ...extra })
      apply
        .then(() => {
          this.$message.success('申请已提交')
        })
      return apply
    }
  }
}
</script>
