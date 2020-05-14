
<script>
export default {
  props: {
    value: {
      type: [String, Number],
      default: undefined
    },
    keepSpace: {
      type: Boolean,
      default: true
    },
    status: {
      type: String,
      default: '', // added removed
    },
    added: {
      type: Boolean,
      default: false
    },
    modified: {
      type: Boolean,
      default: false
    },
    removed: {
      type: Boolean,
      default: false
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
      modifiedValue: null,
      editable: false
    }
  },
  computed: {
    isModified () {
      return this.modifiedValue !== null
    },
    currValue () {
      return this.isModified ? this.modifiedValue : this.value
    },
    fillText () {
      // 格式化
      return (/^[\n\s\t]*$/.test(this.currValue) ? '\n' : '') + this.currValue
    },
    statusClass () {
      return this.status || (this.getStatus())
    },
    classes () {
      return [
        'editable-cell',
        this.statusClass
      ]
    }
  },
  methods: {
    getStatus () {
      const status = ['removed', 'added', 'modified']
      for (const s of status) {
        if (this[s]) {
          return s
        }
      }
      return this.isModified ? 'modified' : 'normal'
    },
    onChange (e) {
      let value = e.target.value
      if (value === this.value) {
        value = null
      }
      this.modifiedValue = value
    },
    doStartEdit () {
      this.editable = true
    },
    onSave () {
      // 如果为空，则重置
      if (/^[\n\s\t]*$/.test(this.modifiedValue)) {
        this.modifiedValue = null
      } else if (!this.keepSpace) {
        this.modifiedValue = this.modifiedValue.replace(/[\n\s\t]*/, '')
      }

      this.$emit('update:status', this.getStatus(), this.modifiedValue)
      this.editable = false
    },
    reset () {
      this.modifiedValue = ''
      this.onSave()
    },
    // render
    renderInput () {
      const on = { blur: this.onSave, change: this.onChange }
      const directives = [{ name: 'focus' }]
      return <div class={this.classes}>
        <a-textarea class='editable-cell--input' { ...{ on, directives } } value={this.currValue}/>
        <div class='editable-cell--text'>{ this.fillText || ' ' }</div>
      </div>
    },
    renderText () {
      return <div class={this.classes} onDblclick={this.doStartEdit}>
        <div class='editable-cell--text'>{ this.currValue || ' ' }</div>
        {this.isModified && <a-icon class='editable-cell--redo' title={'重置为:' + this.value} type="reload" onClick={this.reset} />}
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
  &.modified {
    color: #eda700;
  }
  &.added, &.added-head, &.added-tail {
    color: #00c024;
  }
  &.removed {
    color: #ff0000;
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
  &--redo {
    display: none;
    position: absolute;
    right: 4px;
    bottom: 4px;
    z-index: 1;
  }
  &:hover {
    .editable-cell--redo {
      display: inline-block;
    }
  }
}
</style>
