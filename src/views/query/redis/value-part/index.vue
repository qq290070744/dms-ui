<template>
  <div class="redis-value">
    <div class="tag"></div>
    <value-page :redisObject="redisObject">
      <type-strategy :redisObject="redisObject"></type-strategy>
    </value-page>
  </div>
</template>

<script>
import ValuePage from './page'
import TypeStrategy from './types/type-strategy'
import { defaultRedisObject } from '../utils'
export default {
  components: {
    ValuePage,
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
  }
}
</style>
