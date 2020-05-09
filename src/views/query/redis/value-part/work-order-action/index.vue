<script>
import WorkOrderForm from './work-order-form'
import { queryApprovalUser } from '@/api/users'
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
      if (this.disabled || !this.genActionObject) {
        return
      }
      queryApprovalUser().then((result) => {
        this.auditors = result.map(u => ({ label: u.name, value: u.id }))
      })
      const actionObject = this.genActionObject() || null
      this.currActionObject = actionObject
    },
    handleOk () {
      if (this.disabled) { return }
      this.$refs.form.submit().then(() => {
        this.handleCancel()
      })
    },
    handleCancel () {
      this.currActionObject = null
    },
    renderDialog () {
      return (
        <a-modal title="创建工单" visible={this.showDialog} onOk={this.handleOk} onCancel={this.handleCancel}>
          <work-order-form ref="form" auditors={this.auditors} actionObject={this.currActionObject}/>
        </a-modal>
      )
    }
  },
  render () {
    return <div class="work-order-action">
      { this.showDialog && this.renderDialog() }
      <a-button disabled={this.disabled} size="small" onClick={this.showWorkOrder}>生成工单</a-button>
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
