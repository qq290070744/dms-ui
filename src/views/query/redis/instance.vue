<template>
  <split-window class="redis-query-container">
    <template #left>
      <redis-key-list></redis-key-list>
    </template>
    <template #right>
      <redis-value-part></redis-value-part>
    </template>
  </split-window>
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
.redis-query-container {
  height: 100%;
}
.redis-key {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 400px;
  &--function-area, &--title {
    padding: 0 8px;
  }
}
.ant-row {
  margin-top: 8px;
}
</style>
