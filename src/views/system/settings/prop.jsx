export default {
  props: {
    type: {
      type: String,
      default: 'string',
      require: true
    },
    value: {
      type: String,
      default: undefined,
    }
  },
  computed: {
    rMethod () {
      return `r${this.type.slice(0, 1).toUpperCase()}${this.type.slice(1)}`
    }
  },
  methods: {
    triggerChange (v) {
      this.$emit('change', v)
    },
    rBool () {
      return <a-switch checked-children="开" un-checked-children="关" onChange={(v) => { this.triggerChange(String(v)) }} checked={this.value === 'true'} />
    },
    rString () {
      return <a-input value={this.value} onChange={(e) => { this.triggerChange(e.target.value) }} style={{ width: '200px' }}/>
    },
    rInt () {
      return <a-input-number min={0} value={this.value} onChange={(v) => { this.triggerChange(v) }} style={{ width: '200px' }}/>
    }
  },
  render () {
    return typeof this[this.rMethod] === 'function' ? this[this.rMethod]() : ''
  }
}
