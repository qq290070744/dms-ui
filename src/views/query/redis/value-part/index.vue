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
export default {
  components: {
    ValuePage,
    TypeStrategy
  },
  data () {
    return {
      redisObject: { key: 'unique-key', value: 'lalalalala', type: 'hash' }
    }
  }
}
</script>

<style lang="less">
.redis-value {
  height: 100%;
  display: flex;
  flex-direction: column;

  &-page {
    flex: 1;
  }
}
</style>
