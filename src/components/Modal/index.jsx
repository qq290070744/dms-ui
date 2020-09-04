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
      form: null,
      loading: false
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
        this.loading = true
        const promise = this.onOk(values)
        if (promise instanceof Promise) {
          promise.then(() => {
            if (!this.silent) {
              this.$message.success(`${this.title}成功`)
            }
            this.loading = false
            this.handleCancel()
          }, () => {
            this.loading = false
          })
        } else {
          this.loading = false
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

      return (
        <a-modal
          props={modalProps}
          onCancel={this.handleCancel}
        >
          {
            this.$scopedSlots
              .default({
                rFlag: this.rFlag,
                close: this.handleCancel,
                registerForm: this.registerForm
              })
          }
          <template slot="footer">
            <a-button key="back" onClick={this.handleCancel}>
              取消
            </a-button>
            <a-button key="submit" type="primary" loading={this.loading} onClick={this.handleOk}>
              提交
            </a-button>
          </template>
        </a-modal>
      )
    }
  },
  render () {
    const { title, button } = this.$props
    return <span class="ys-modal-trigger">
      { this.showDialog && this.renderDialog() }
      {
        this.$scopedSlots.trigger
          ? this.$scopedSlots.trigger({ trigger: this.show })
          : <a-button props={button} onClick={this.show}>{button.title || title}</a-button>
      }
    </span>
  }
}
