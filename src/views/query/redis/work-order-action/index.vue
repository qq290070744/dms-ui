<script>
import WorkOrderForm from './work-order-form'
import { queryApprovalUser } from '@/api/users'
import { createWorkOrder } from '@/api/work-order'
export default {
  components: {
    WorkOrderForm,
  },
  props: {
    genActionObject: {
      type: Function,
      default: null
    },
    extraParams: {
      type: Object,
      default () { return {} }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '创建工单'
    }
  },
  data () {
    return {
      currActionObject: null,
      auditors: []
    }
  },
  computed: {
    showDialog () {
      return !!this.currActionObject
    }
  },
  methods: {
    showWorkOrder () {
      if (this.disabled) {
        return
      }
      queryApprovalUser().then((result) => {
        this.auditors = result.map(u => ({ label: u.name, value: u.id }))
      })
      const actionObject = typeof this.genActionObject === 'function' ? this.genActionObject() : { actions: [], commands: [] }
      this.currActionObject = actionObject
    },
    handleOk () {
      if (this.disabled) { return }
      this.$refs.form.submit().then((values) => {
        createWorkOrder({ ...values, ...this.extraParams }).then(() => {
          this.$message.success('创建工单成功')
          this.handleCancel()
          this.$emit('success')
        })
      })
    },
    handleCancel () {
      this.currActionObject = null
    },
    renderDialog () {
      return (
        <a-modal title={this.title} visible={this.showDialog} onOk={this.handleOk} onCancel={this.handleCancel} width={1000}>
          <work-order-form ref="form" auditors={this.auditors} actionObject={this.currActionObject}/>
        </a-modal>
      )
    }
  },
  render () {
    return <div class="work-order-action">
      { this.showDialog && this.renderDialog() }
      <a-button disabled={this.disabled} size="small" onClick={this.showWorkOrder}>{this.title}</a-button>
    </div>
  }
}
</script>

<style scoped>
.work-order-action {
  margin-left: 8px;
  display: inline-block;
}
</style>
