import AButton from 'ant-design-vue/es/button'
export default {
  props: {
    ...AButton.props,
    title: {
      type: String,
      default: '创建工单'
    }
  },
  data () {
    return {
      showDialog: false,
      rFlag: 0,
      formVm: null
    }
  },
  methods: {
    show () {
      if (this.disabled) {
        return
      }
      this.rFlag++
      this.showDialog = true
    },
    handleOk () {
      if (this.disabled || !this.formVm || !this.formVm.submit) { return }
      this.formVm.submit().then(() => {
        this.$message.success(`${this.title}成功`)
        this.handleCancel()
        this.$emit('success')
      })
    },
    handleCancel () {
      this.showDialog = false
    },
    renderDialog () {
      return (
        <a-modal title={this.title} visible={this.showDialog} onOk={this.handleOk} onCancel={this.handleCancel} width={1000}>
          {this.$scopedSlots.default({ rFlag: this.rFlag, close: this.handleCancel, register: (formVm) => { this.formVm = formVm } })}
        </a-modal>
      )
    }
  },
  render () {
    const { title, ...props } = this.$props
    return <span class="ys-modal-trigger">
      { this.showDialog && this.renderDialog() }
      <a-button props={props} onClick={this.show}>{title}</a-button>
    </span>
  }
}
