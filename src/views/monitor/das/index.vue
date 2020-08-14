<template>
  <div class="das-container">
    <a-spin :spinning="spinning">
      <iframe v-if="url" :src="url" frameborder="0"></iframe>
    </a-spin>
  </div>
</template>

<script>
import { getMonitorUrl } from '@/api/monitor'
export default {
  name: 'MonitorDas',
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.showMonitor()
    })
  },
  data () {
    return {
      url: '',
      spinning: false
    }
  },
  methods: {
    showMonitor () {
      this.spinning = true
      getMonitorUrl()
        .then((url) => {
          this.url = url
          setTimeout(() => {
            this.spinning = false
          }, 5000)
          // window.open(url)
        })
    }
  }
}
</script>

<style lang="less" scoped>
.das-container {
  width: 100%;
  height: 100%;
  ::v-deep .ant-spin-container {
    width: 100%;
    height: 100%;
  }
  .ant-spin-nested-loading, iframe {
    width: 100%;
    height: 100%;
  }
}
</style>
