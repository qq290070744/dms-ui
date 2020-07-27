<template>
  <a class="refresh-action" @click="refresh">
    <span class="refresh-action-auto">每3秒自动刷新状态</span>
    <span class="refresh-action-manual">手动刷新</span>
  </a>
</template>

<script>
export default {
  data () {
    return {
      timer: null,
      interval: 3000
    }
  },
  mounted () {
    this.timer = setInterval(() => {
      this.refresh()
    }, this.interval)
  },
  beforeDestroy () {
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
  methods: {
    refresh () {
      this.$emit('refresh')
    }
  }
}
</script>

<style scoped lang="less">
.refresh-action {
  width: 120px;
  display: inline-block;
  &-manual {
    display: none;
  }

  &:hover & {
    &-manual {
      display: initial;
    }
    &-auto {
      display: none;
    }
  }
}
</style>
