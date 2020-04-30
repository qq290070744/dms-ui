
<script>
export default {
  props: {
    value: {
      type: [String, Number],
      default: undefined
    }
  },
  directives: {
    focus: {
      inserted: function (el) {
        el.focus()
      }
    }
  },
  data () {
    return {
      modify: null,
      editable: false
    }
  },
  computed: {
    currValue () {
      return this.modify !== null ? this.modify : this.value
    },
    classes () {
      return [
        'editable-cell',
        this.modify ? 'modify' : ''
      ]
    }
  },
  methods: {
    onChange (e) {
      this.modify = e.target.value !== this.value ? e.target.value : ''
    },
    doStartEdit () {
      this.editable = true
    },
    onSave () {
      this.editable = false
    },
    // render
    renderInput () {
      const on = { blur: this.onSave, change: this.onChange }
      const directives = [{ name: 'focus' }]
      return <div class={this.classes}>
        <a-textarea class='editable-cell--input' { ...{ on, directives } } value={this.currValue}/>
        {this.modify && <a-icon type="book"/>}
        <div class='editable-cell--text'>{ this.currValue || ' ' }</div>
      </div>
    },
    renderText () {
      return <div class={this.classes} onDblclick={this.doStartEdit}>
        <div class='editable-cell--text'>{ this.currValue || ' ' }</div>
      </div>
    }
  },
  render () {
    return this.editable
      ? this.renderInput()
      : this.renderText()
  }
}
</script>

<style lang="less">

.editable-cell {
  width: 100%;
  height: 100%;
  position: relative;
  &.modify {
    color: red;
  }
  & .ant-input {
    position: absolute;
    height: 100%;
    resize: none;
    border: 0;
    padding: 0;
    min-height: 0;
    &:focus {
      box-shadow: none;
    }
  }
  & .editable-cell--text {
    white-space: break-spaces;
    word-break: break-all;
    height: 100%;
  }
}
</style>
