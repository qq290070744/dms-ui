<template>
  <div class="redis-value-page">
    <div class="redis-value-page--top">
      <span>键名：</span>
      <span>
        <a-input :addonAfter="keyType" readOnly :value="keyName"></a-input>
      </span>
      <span>TTL：</span>
      <span><a-input v-model="ttl" read-only class="redis-value-page--ttl-input"></a-input></span>
      <span class="redis-value-page--ttl-unit">(s)</span>
      <a-button>修改</a-button>
    </div>
    <div class="redis-value-page--content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { defaultRedisObject } from '../utils'
export default {
  props: {
    redisObject: {
      default: defaultRedisObject,
      type: Object
    }
  },
  data () {
    return { }
  },
  computed: {
    keyName () {
      return this.redisObject && this.redisObject.key
    },
    keyType () {
      return this.redisObject && this.redisObject.type
    },
    ttl () {
      return this.redisObject && this.redisObject.ttl
    }
  }
}
</script>

<style lang="less">
.redis-value-page {
  display: flex;
  flex-direction: column;
  &--top {
    padding: 10px;
    display: flex;
    align-items: center;

    & > span {
      margin-right: 8px;
    }
  }
  &--content {
    flex: 1;
  }
  &--ttl-input {
    width: 80px;
  }
}
</style>
