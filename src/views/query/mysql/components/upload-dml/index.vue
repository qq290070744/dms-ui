<template>
  <x-modal
    title="提交DML文件工单"
    :silent="true"
    :onOk="create"
    :width="1000"
  >
    <template #default="{registerForm}" >
      <x-form :registerForm="registerForm" :fields="fields" :layoutCol="[3, 20]"></x-form>
    </template>
    <template #trigger="{trigger}">
      <a-tooltip placement="top">
        <template slot="title">
          DML 工单如果有需要大量（500条以上）插入语句，最好使用文件工单进行提交。
        </template>
        <a-button type="primary" size="small" :disabled="disabled" @click="trigger">
          <span> DML文件工单 </span>
        </a-button>
      </a-tooltip>
    </template>
  </x-modal>
</template>

<script>
import { apiPostSqlFileWorkOrderSubmitSqlFileWorkOrder } from '@/api/work-order'
import XUpload from './upload'
export default {
  components: {
    XUpload
  },
  props: {
    extra: {
      type: [Object, Function],
      default: () => ({})
    },
    disabled: {
      default: false,
      type: Boolean
    }
  },
  data () {
    return {
      fields: [
        ['sql_file_path', 'SQL文件', {
          required: true,
          component: (data) => {
            return <x-upload {...data}/>
          }
        }],
        ['auditor_id', '审批人', {
          required: true,
          component: 'XAuditorSelector'
        }],
        ['remark', '工单说明', {
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
      const apply = apiPostSqlFileWorkOrderSubmitSqlFileWorkOrder({ ...data, ...extra })
      apply
        .then(() => {
          this.$message.success('工单已提交')
        })
      return apply
    }
  }
}
</script>
