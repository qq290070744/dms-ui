<template>
  <x-modal
    title="提交工单"
    :silent="true"
    :onOk="create"
    :width="1000"
    :button="button"
  >
    <template #default="{registerForm}" >
      <x-form :register="registerForm" :sql="sql"></x-form>
    </template>
  </x-modal>
</template>

<script>
import { createWorkOrder } from '@/api/work-order'
import XForm from './form'
export default {
  components: {
    XForm
  },
  props: {
    extra: {
      type: [Object, Function],
      default: () => ({})
    },
    sql: {
      type: String,
      default: ''
    },
    disabled: {
      default: false,
      type: Boolean
    }
  },
  data () {
    return {
      fields: [
        ['', '工单内容(命令)', {
          required: true,
          component: 'XMonacoEditor',
          props: {
            value: this.sql,
            readOnly: true,
            language: 'mysql'
          }
        }],
        ['auditor_id', '审批人', {
          required: true,
          component: 'XAuditorSelector'
        }],
        ['reason', '工单说明', {
          required: true,
          component: 'a-textarea'
        }],
      ]
    }
  },
  computed: {
    button () {
      return {
        type: 'primary',
        size: 'small',
        disabled: this.disabled
      }
    }
  },
  methods: {
    create (data) {
      const extra = typeof this.extra === 'function' ? this.extra() : this.extra
      const apply = createWorkOrder({ ...data, ...extra, sql: this.sql })
      apply
        .then(() => {
          this.$message.success('工单已提交')
        })
      return apply
    }
  }
}
</script>
