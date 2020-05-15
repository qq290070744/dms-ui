<template>
  <div class="redis-value-part--base-info">
    <span>键名：</span>
    <span>
      <a-input
        size="small"
        class="redis-value-part--key-input"
        :addonAfter="keyType"
        :readOnly="createMode"
        :value="keyName"
        @input="(e) => { inner.key = e.target.value }"
      ></a-input>
    </span>
    <span>TTL：</span>
    <span>
      <a-input
        :value="ttl"
        @input="(e) => { inner.ttl = e.target.value }"
        size="small"
        :class="['redis-value-part--ttl-input', {modified: !!inner.ttl}]"
        :addonAfter="'(s)'"
      />
    </span>
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
    return {
      inner: {
        key: '',
        type: '',
        ttl: '',
        temp: ''
      }
    }
  },
  computed: {
    keyName () {
      return this.getValue('key')
    },
    keyType () {
      return this.getValue('type')
    },
    ttl () {
      return this.getValue('ttl')
    },
    createMode () {
      return !this.getValue('temp')
    }
  },
  methods: {
    getValue (key) {
      return this.inner[key] || (this.redisObject && this.redisObject[key])
    }
  }
}
</script>

<style lang="less">
.redis-value-part--base-info {
  padding: 10px;
  display: flex;
  align-items: center;

  & > span {
    margin-right: 8px;
  }
}
.redis-value-part--key-input {
  width: 250px;
  &.modified input {
    color: #eda700;
  }
}
.redis-value-part--ttl-input {
  width: 120px;
  &.modified input {
    color: #eda700;
  }
}
</style>
