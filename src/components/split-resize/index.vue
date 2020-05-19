<template>
  <div class="split-resize" :style="{height: height + 'px'}" :class="{vertical: vertical}">
    <div class="split-resize--aside" :style="asideStyle">
      <slot name="aside"></slot>
    </div>
    <div class="split-resize--main">
      <slot name="main"></slot>
      <slot></slot>
    </div>
    <div class="split-resize--control" @mousedown="startResize" :style="controlStyle"></div>
  </div>
</template>

<script>
import { genRange, resize } from './utils'
export default {
  props: {
    vertical: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      asideWidth: 400,
      height: '100%'
    }
  },
  computed: {
    asideStyle () {
      return this.vertical ? { height: this.asideWidth + 'px' } : { width: this.asideWidth + 'px' }
    },
    controlStyle () {
      return this.vertical ? { top: this.asideWidth + 'px' } : { left: this.asideWidth + 'px' }
    }
  },
  methods: {
    startResize (ev) {
      const range = genRange(this.$el, this.vertical)
      resize(
        ev, this.asideWidth, range,
        (width) => {
          this.asideWidth = width
        },
        this.vertical
      )
    }
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

  user-select: none;
  &--main, &--aside {
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
    top: 0;
    left: 0;
    width: @split-width;
    height: 100%;
    cursor: col-resize;
    &:hover {
      background-color: rgba(51, 51, 51, 0.1)
    }

  }

  &.vertical {
    flex-direction: column;
  }
  &.vertical & {
    &--control {
      height: @split-width;
      width: 100%;
      cursor: row-resize;
    }
    &--main {
      margin-top: @split-width;
      margin-left: 0;
    }
  }
}
</style>
