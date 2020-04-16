<template>
  <router-view></router-view>
</template>

<script>
import SplitWindow from './split-window'
import RedisKeyList from './key-list'
import RedisValuePart from './value-part'
export default {
  components: {
    SplitWindow,
    RedisKeyList,
    RedisValuePart
  },
  data () {
    return {
      redis: {
        curr: '',
        list: [{ label: 'DBO', value: 'DBO' }]
      },
      exactSearch: false
    }
  },
  methods: {
    doSearch (e) {
      // exactSearch
      console.log(e.target.value)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
