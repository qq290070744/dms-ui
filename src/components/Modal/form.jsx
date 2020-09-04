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
    },
    size: {
      type: String,
      default: 'default'
    }
  },
  data () {
    return {
      formVm: null,
      invisible: {}
    }
  },
  created () {
    this.formVm = this.$form.createForm(this)
    if (typeof this.registerForm === 'function') {
      this.registerForm(this.formVm)
    }
  },
  mounted () {
    this.fields.map(field => {
      // eslint-disable-next-line no-unused-vars
      const [prop, label, settings = {}] = field
      const isInit = true
      if (settings.onChange) {
        const { show, hide } = this
        settings.onChange(this.initialValues[prop], this.formVm, { show, hide, isInit })
        // this.$forceUpdate()
      }
    })
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
        this.$set(this.invisible, key, true)
      }
    },
    show (keys = []) {
      for (const key of keys) {
        this.$set(this.invisible, key, false)
      }
    },
    rButton ({ labelCol, wrapperCol }) {
      const [
        defaultSubmitText,
        defaultCancelText
      ] = this.$listeners.filter ? ['筛选', '重置'] : ['保存', '取消']
      const [
        submitText = defaultSubmitText,
        cancelText = defaultCancelText
      ] = this.button ? this.button.split('|') : []
      wrapperCol = wrapperCol ? { span: wrapperCol?.span, offset: labelCol?.span } : undefined
      return <a-form-item wrapperCol={wrapperCol}>
        <a-button size={this.size} type="primary" onClick={this.onSubmit}>{submitText}</a-button>
        {
          (this.$listeners.cancel || cancelText) &&
          <a-button size={this.size} onClick={this.onCancel}>{cancelText}</a-button>
        }
      </a-form-item>
    },
    rContent (component, data) {
      if (typeof component === 'function') {
        return component(data)
      }
      return <component {...data}></component>
    },
    rItems (layout) {
      const { getFieldDecorator } = this.formVm
      const items = this.fields
        .map((field) => {
          const [prop, label, settings = {}] = field
          if (this.invisible[prop]) {
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
          if (!props.size) {
            props.size = this.size
          }
          return <a-form-item label={label}>
            {
              prop
                ? getFieldDecorator(prop, resetSettings)(
                  this.rContent(component, { props, attrs, on })
                )
                : this.rContent(component, { props, attrs, on })
            }
          </a-form-item>
        })
      const buttons = this.$listeners.submit || this.$listeners.filter
        ? this.rButton(layout)
        : undefined
      return buttons ? [...items, buttons] : items
    }
  },
  render () {
    const [label, wrapper] = this.layoutCol
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
      { this.rItems(layout) }
    </a-form>
  }
}
