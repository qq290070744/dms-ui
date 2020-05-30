<template>
  <split-window class="redis-query-container">
    <template #aside>
      <redis-key-list @value-change="(value) => currRedisObject = value"></redis-key-list>
    </template>
    <redis-value-part :redisObject="currRedisObject"></redis-value-part>
  </split-window>
</template>

<script>
import SplitWindow from '@/components/split-resize'
import RedisKeyList from './key-list'
import RedisValuePart from './value-part'
export default {
  components: {
    SplitWindow,
    RedisKeyList,
    RedisValuePart
  },
  beforeRouteEnter (to, from, next) {
    // console.log()
    if (/\d+/.test(to.params.instance_id)) {
      next()
    } else {
      next({ name: 'queryRedisInstances' })
    }
  },
  data () {
    return {
      currRedisObject: null
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
