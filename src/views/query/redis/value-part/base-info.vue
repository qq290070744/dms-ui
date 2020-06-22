<template>
  <div class="redis-value-part--base-info">
    <span>键名：</span>
    <span>
      <a-input
        size="small"
        class="redis-value-part--key-input"
        :readOnly="viewMode"
        :value="keyName"
        @input="(e) => { inner.key = e.target.value }"
      >
        <template #addonAfter>
          <a-select v-if="!viewMode" :defaultValue="keyType" style="width: 80px" @change="onTypeChange" :options="types"/>
          <span v-else>{{ keyType }}</span>
        </template>
      </a-input>
    </span>
    <span>TTL：</span>
    <span>
      <a-input
        :value="ttl"
        @input="(e) => { inner.ttl = e.target.value }"
        size="small"
        :class="['redis-value-part--ttl-input', {modified: inner.ttl && inner.ttl !== getOValue('ttl')}]"
        :addonAfter="'(s)'"
      />
    </span>
    <a-tooltip placement="top" title="双击进入编辑模式，按 ESC 退出">
      <a-icon type="question-circle" />
    </a-tooltip>
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
      },
      types: ['string', 'list', 'hash', 'set', 'zset'].map(v => ({ label: v, value: v }))
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
    viewMode () {
      return !this.getValue('temp')
    }
  },
  watch: {
    inner: {
      deep: true,
      handler () {
        this.onChange()
      }
    },
    redisObject () {
      this.inner = {
        key: '',
        type: '',
        ttl: '',
        temp: ''
      }
    }
  },
  methods: {
    getValue (key) {
      return this.inner[key] || this.getOValue(key)
    },
    getOValue (key) {
      return this.redisObject && this.redisObject[key]
    },
    onChange () {
      const payload = Object.keys(this.inner).reduce((obj, key) => {
        obj[key] = this.inner[key] === (this.redisObject[key] + '') ? '' : this.inner[key]
        return obj
      }, {})
      this.$emit('change', payload)
    },
    onTypeChange (type) {
      this.inner.type = type
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
