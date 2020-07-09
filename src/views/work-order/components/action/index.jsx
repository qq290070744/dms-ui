export default {
  render () {
    return <span>
      <a-popconfirm title="确认通过该项申请？" onConfirm={() => { this.$emit('pass') }}>
        <a-button type="primary" size="small">通过</a-button>
      </a-popconfirm>
      <a-popconfirm title="确认驳回该项申请？" onConfirm={() => { this.$emit('reject') }}>
        <a-button type="danger" size="small">驳回</a-button>
      </a-popconfirm>
    </span>
  }
}
