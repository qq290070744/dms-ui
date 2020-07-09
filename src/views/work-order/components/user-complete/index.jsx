import { mapGetters } from 'vuex'

export default {
  props: {
    value: {
      type: [Number, Array, String],
      default: undefined,
    }
  },
  computed: {
    ...(mapGetters(['nickname'])),
  },
  render () {
    return <a-auto-complete
      placeholder="请输入审核人或选择自己" dataSource={[this.nickname]}
      value={this.value}
      onChange={(v) => { this.$emit('change', v) }}
    />
  }
}
