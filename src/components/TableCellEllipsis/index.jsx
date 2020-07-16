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
      Modal.info({
        icon: () => '',
        content: <pre>{text}</pre>,
        width: '50vw'
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
