import { Modal } from 'ant-design-vue'

export default {
  name: 'XTableCellEllipsis',
  props: {
    text: {
      type: String,
      default: ''
    },
    max: {
      type: Number,
      default: 350
    }
  },
  methods: {
    showFull (text) {
      const modal = Modal.info({
        icon: () => '',
        content: <pre style={{ height: '70vh', overflow: 'auto' }}>{text}</pre>,
        width: '70vw',
        onOk: () => {
          modal.destroy()
        }
      })
    }
  },
  render () {
    const { text, max } = this
    if (text.length > max) {
      return <span>
        {text.slice(0, max)}...
        <a-button type="link" onClick={() => this.showFull(text)}>查看完整</a-button>
      </span>
    } else {
      return <span>{text}</span>
    }
  }
}
