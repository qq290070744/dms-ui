<script>
import { genRange, resize } from './utils'
export default {
  props: {
    vertical: {
      type: Boolean,
      default: false
    },
    autoStart: {
      type: Boolean,
      default: false
    },
    asideWidth: {
      type: Number,
      default: 400
    }
  },
  data () {
    return {
      innerAsideWidth: 0,
      height: '100%'
    }
  },
  watch: {
    asideWidth (val) {
      this.innerAsideWidth = val
    }
  },
  computed: {
    finalAsideWidth () {
      return this.innerAsideWidth || this.asideWidth
    },
    asideStyle () {
      const len = this.finalAsideWidth + 'px'
      return this.vertical ? { height: len } : { width: len }
    },
    controlKey () {
      // top right bottom left
      // Va  vA    VA     va
      const keys = [['left', 'right'], ['top', 'bottom']]
      const key = keys[Number(this.vertical)][Number(this.autoStart)]
      return key
    },
    controlStyle () {
      const len = this.finalAsideWidth + 'px'
      return { [this.controlKey]: len }
    }
  },
  methods: {
    startResize (ev) {
      ev.preventDefault()
      const range = genRange(this.$el, this.vertical, this.autoStart)
      resize(
        ev, this.finalAsideWidth, range,
        (width) => {
          this.innerAsideWidth = width
        },
        this.vertical,
        this.autoStart
      )
    }
  },
  render () {
    const aside = <div class="split-resize--aside" style={this.asideStyle}>
      {this.$slots.aside}
    </div>
    const main = <div class="split-resize--main">
      {this.$slots.main || this.$slots.default}
    </div>
    return <div style={{ height: this.height + 'px' }} class={['split-resize', { vertical: this.vertical, 'auto-start': this.autoStart }]}>
      {this.autoStart ? [main, aside] : [aside, main]}
      <div class="split-resize--control" onMousedown={this.startResize} style={this.controlStyle}></div>
    </div>
  }
}
</script>

<style lang="less" scoped>
@split-width: 6px;
.split-resize {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;

  &--main, &--aside {
    box-sizing: border-box;
    height: 100%;
    background-color: #fff;
    overflow: hidden;
  }
  &--main {
    margin-left: @split-width;
    flex: 1;
  }

  &--control {
    position: absolute;
    top: initial;
    left: initial;
    right: initial;
    bottom: initial;
    width: @split-width;
    height: 100%;
    cursor: col-resize;
    background-color: rgba(100, 100, 100, 0.1);
    &:hover {
      background-color: rgba(100, 100, 100, 0.2);
    }
    &::before {
      position: absolute;
      margin-left: -@split-width / 2;
      margin-top: -10px;
      top: 50%;
      left: 50%;

      content: '';
      width: @split-width;
      height: 20px;
      background-color: #aaa;
    }
    &::after {
      position: absolute;
      margin-left: -2px;
      top: 50%;
      left: 50%;
      content: '';
      width: 4px;
      height: 1px;
      background-color: #eee;
      z-index: 2;
      box-shadow: 0 3px 0 #eee, 0 -3px 0 #eee;
    }
  }

  &.vertical {
    flex-direction: column;
  }
  &.auto-start & {
    &--main {
      margin-right: @split-width;
      margin-left: initial;
    }
  }
  &.vertical & {
    &--control {
      height: @split-width;
      width: 100%;
      cursor: row-resize;
      &::before {
        transform: rotate(90deg);
      }
      &::after {
        transform: rotate(90deg);
      }
    }
    &--main {
      margin-top: @split-width;
      margin-left: 0;
    }
  }
  &.vertical.auto-start & {
    &--main {
      margin-bottom: @split-width;
      margin-top: initial;
      margin-right: initial;
    }
  }
}
</style>
