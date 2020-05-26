<template>
  <div class="redis-value">
    <div class="tag"></div>
    <type-strategy :redisObject="redisObject"></type-strategy>
  </div>
</template>

<script>
import TypeStrategy from './types/type-strategy'
import { defaultRedisObject } from '../utils'
export default {
  components: {
    TypeStrategy
  },
  props: {
    redisObject: {
      type: Object,
      default: defaultRedisObject()
    }
  }
}
</script>

<style lang="less">
.redis-value {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 8px;

  &-page {
    flex: 1;
    overflow: hidden;
  }
}
</style>
