import AModal from 'ant-design-vue/es/modal'
import omit from 'omit.js'
export default {
  name: 'XModal',
  props: {
    ...AModal.props,
    silent: {
      type: Boolean,
      default: false
    },
    button: {
      type: Object,
      default: () => ({ type: 'primary' })
    },
    onOk: {
      type: Function,
      default: () => () => undefined
    }
  },
  data () {
    return {
      showDialog: false,
      rFlag: 0,
      form: null
    }
  },
  methods: {
    registerForm (form) {
      this.form = form
    },
    show () {
      if (this.disabled) {
        return
      }
      this.rFlag++
      this.showDialog = true
    },
    handleOk () {
      if (this.disabled || !this.form) { return }
      this.form.validateFields((err, values) => {
        if (err) {
          return
        }
        const promise = this.onOk(values)
        if (promise instanceof Promise) {
          promise.then(() => {
            if (!this.silent) {
              this.$message.success(`${this.title}成功`)
            }
            this.handleCancel()
          })
        }
      })
    },
    handleCancel () {
      this.showDialog = false
    },
    renderDialog () {
      const modalProps = {
        ...omit(this.$props, ['silent', 'button']),
        visible: this.showDialog
      }
      const on = {
        ok: this.handleOk,
        cancel: this.handleCancel
      }
      return (
        <a-modal
          props={modalProps}
          on={on}
        >
          {
            this.$scopedSlots
              .default({
                rFlag: this.rFlag,
                close: this.handleCancel,
                registerForm: this.registerForm
              })
          }
        </a-modal>
      )
    }
  },
  render () {
    const { title, button } = this.$props
    return <span class="ys-modal-trigger">
      { this.showDialog && this.renderDialog() }
      <a-button props={button} onClick={this.show}>{button.title || title}</a-button>
    </span>
  }
}
