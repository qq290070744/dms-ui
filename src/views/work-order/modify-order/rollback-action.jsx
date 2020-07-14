import Vue from 'vue'
import { getRollbackSql, createWorkOrder } from '@/api/work-order'
export default Vue.extend({
  props: {
    workId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      showDialog: false,
      fetching: false,
      error: false,
      rFlag: 0,
      formVm: null,
      title: '回滚',
      sql: '',
      exParams: {}
    }
  },
  methods: {
    show () {
      if (this.disabled) {
        return
      }
      if (this.sql) {
        this.rFlag++
        this.showDialog = true
      } else {
        this.fetching = true
        getRollbackSql(this.workId)
          .then((result) => {
            // eslint-disable-next-line
            const { type, inst_id, db_name, sql } = result
            this.exParams = { type, inst_id, db_name }
            this.fetching = false
            this.sql = sql
            this.rFlag++
            this.showDialog = true
          }, () => {
            this.error = true
            this.fetching = false
          })
      }
    },
    handleOk () {
      if (this.disabled || !this.formVm) { return }
      this.formVm.validateFields((err, values) => {
        if (err) {
          return
        }
        const apply = createWorkOrder({ ...values, ...this.exParams, sql: this.sql })
        apply
          .then(() => {
            this.$message.success('工单已提交')
            this.$emit('success')
            this.handleCancel()
          })
        return apply
      })
    },
    handleCancel () {
      this.showDialog = false
    },
    renderDialog () {
      return (
        <a-modal title={this.title} visible={this.showDialog} onOk={this.handleOk} onCancel={this.handleCancel} width={1000}>
          {this.$scopedSlots.default({
            rFlag: this.rFlag,
            close: this.handleCancel,
            register: (formVm) => { this.formVm = formVm },
            sql: this.sql,
            exParams: this.exParams
          })}
        </a-modal>
      )
    }
  },
  render () {
    return <span class="ys-modal-trigger">
      { this.showDialog && this.renderDialog() }
      {
        this.fetching
          ? <a>获取中...</a>
          : this.error
            ? <a style={{ color: '#ff6666' }}>获取回滚语句失败</a>
            : <a onClick={this.show}>{this.title}</a>
      }
    </span>
  }
})
