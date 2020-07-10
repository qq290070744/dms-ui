import AForm from 'ant-design-vue/es/form'

export default {
  name: 'XForm',
  props: {
    ...AForm.props,
    fields: {
      type: Array,
      default: () => []
    },
    layoutCol: {
      type: Array,
      default: () => [4, 14]
    },
    initialValues: {
      type: Object,
      default: () => ({})
    },
    registerForm: {
      type: Function,
      default: () => () => undefined
    },
    button: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      formVm: null,
      invisible: new Set()
    }
  },
  created () {
    this.formVm = this.$form.createForm(this)
    if (typeof this.registerForm === 'function') {
      this.registerForm(this.formVm)
    }
  },
  methods: {
    onSubmit () {
      this.formVm.validateFields((err, values) => {
        if (err) {
          return
        }
        this.$emit('submit', values)
        this.$emit('filter', values)
      })
    },
    onCancel () {
      const keys = Object.keys(this.initialValues)
      this.formVm.resetFields(keys.length ? keys : undefined)
      this.$emit('submit', this.initialValues)
      this.$emit('filter', this.initialValues)
    },
    hide (keys = []) {
      for (const key of keys) {
        this.invisible.add(key)
      }
    },
    show (keys = []) {
      for (const key of keys) {
        this.invisible.delete(key)
      }
    },
    rButton () {
      const [
        defaultSubmitText,
        defaultCancelText
      ] = this.$listeners.filter ? ['筛选', '重置'] : ['保存', '取消']
      const [
        submitText = defaultSubmitText,
        cancelText = defaultCancelText
      ] = this.button ? this.button.split('|') : []
      return <a-form-item>
        <a-button type="primary" onClick={this.onSubmit}>{submitText}</a-button>
        {
          (this.$listeners.cancel || cancelText) &&
          <a-button onClick={this.onCancel}>{cancelText}</a-button>
        }
      </a-form-item>
    },
    rItems () {
      const { getFieldDecorator } = this.formVm
      const items = this.fields
        .map((field) => {
          const [prop, label, settings = {}] = field
          if (this.invisible.has(prop)) {
            return
          }
          const {
            component = 'a-input',
            props = {},
            attrs = {},
            required = false,
            defaultValue,
            onChange,
            ...resetSettings
          } = settings

          if (required) {
            resetSettings.rules = [
              { required: true, message: `${label}不能为空` },
              ...(resetSettings.rules || [])
            ]
          }

          if (resetSettings.initialValue === undefined) {
            resetSettings.initialValue = this.initialValues[prop] || defaultValue
          }
          const { show, hide } = this
          const on = {
            change: (v) => {
              if (typeof onChange === 'function') {
                onChange(v, this.formVm, { show, hide })
              }
            }
          }
          return <a-form-item label={label}>
            {
              getFieldDecorator(prop, resetSettings)(
                <component {...{ props, attrs, on }}></component>
              )
            }
          </a-form-item>
        })
      const buttons = this.$listeners.submit || this.$listeners.filter
        ? this.rButton()
        : undefined
      return buttons ? [...items, buttons] : items
    }
  },
  render () {
    const [ label, wrapper ] = this.layoutCol
    const {
      labelCol = { span: label },
      wrapperCol = { span: wrapper },
      form,
      ...rest
    } = this.$props
    const layout = this.layout === 'inline' ? {} : { labelCol, wrapperCol }
    const props = {
      ...rest,
      ...layout,
      form: this.formVm
    }
    return <a-form props={props}>
      { this.rItems() }
    </a-form>
  }
}
