<template>
  <type-content class="redis-value-string">
    <a-textarea class="redis-value-string--input" @change="onChange" :value="currValue" resize="false"/>
  </type-content>
</template>

<script>
import TypeContent from './type-content'
import { defaultRedisObject } from '../../utils'
export default {
  components: {
    TypeContent
  },
  props: {
    redisObject: {
      default: defaultRedisObject,
      type: Object
    }
  },
  data () {
    return {
      modify: ''
    }
  },
  computed: {
    originValue () {
      return this.redisObject && this.redisObject.value
    },
    currValue () {
      return this.modify || this.originValue
    }
  },
  methods: {
    onChange (e) {
      console.log(e)
    },
    submit () {
      // 未检测到修改，无需提交。
      // key: devops:test:string:key:2  value: test1 dbName: 1
    },
    parseToJson () {
      // try
    }
  }
}
</script>

<style lang="less">
.redis-value-string {
  &--input.ant-input {
    height: 100%;
    resize: none;
  }
}
</style>
