import AForm from 'ant-design-vue/es/form'

export default {
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
    }
  },
  data () {
    return {
      formVm: null
    }
  },
  created () {
    this.formVm = this.$form.createForm(this)
    this.registerForm(this.formVm)
  },
  methods: {
    rItems () {
      const { getFieldDecorator } = this.formVm
      return this.fields
        .map((field) => {
          const [prop, label, settings = {}] = field
          const {
            component = 'a-input',
            props = {},
            attrs = {},
            required = false,
            defaultValue,
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

          return <a-form-item label={label}>
            {
              getFieldDecorator(prop, resetSettings)(
                <component {...{ props, attrs }}></component>
              )
            }
          </a-form-item>
        })
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
    const props = {
      ...rest,
      labelCol,
      wrapperCol,
      form: this.formVm
    }
    return <a-form props={props}>
      { this.rItems() }
    </a-form>
  }
}
