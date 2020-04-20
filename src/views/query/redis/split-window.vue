<template>
  <div class="split-window" :style="{height: height + 'px'}">
    <div class="split-window--left" :style="{width: leftSideWidth + 'px'}">
      <slot name="left"></slot>
    </div>
    <div class="split-window--right">
      <slot name="right"></slot>
    </div>
    <div class="split-window--control" @mousedown="startResize" :style="{left: leftSideWidth + 'px'}"></div>
  </div>
</template>

<script>
import { genRange, resize } from './utils'
export default {
  data () {
    return {
      leftSideWidth: 400,
      height: '100%'
    }
  },
  mounted () {
    this.$nextTick(this.initSize)
  },
  methods: {
    startResize (ev) {
      const range = genRange(this.$el)
      resize(
        ev, this.leftSideWidth, range,
        (width) => {
          this.leftSideWidth = width
        }
      )
    },
    initSize () {
      const { top } = this.$el.getBoundingClientRect()
      const height = document.body.clientHeight - top - 24 // padding
      this.height = height
    }
  }
}
</script>

<style lang="less" scoped>
@split-width: 6px;
.split-window {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;

  user-select: none;

  &--right, &--left {
    height: 100%;
    background-color: #fff;
    overflow: hidden;
  }
  &--right {
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
}
</style>
