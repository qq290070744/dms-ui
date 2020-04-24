<template>
  <type-content class="redis-value-string">
    <div slot="function">
      <label for="">查看方式：</label><a-select v-model="view" :options="views"></a-select>
    </div>
    <a-textarea class="redis-value-string--input" readOnly @change="onChange" :value="renderValue" resize="false"/>
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
      modify: '',
      view: 0,
      views: [{ value: 0, label: 'text' }, { value: 1, label: 'json' }]
    }
  },
  computed: {
    originValue () {
      return this.redisObject && this.redisObject.value
    },
    currValue () {
      return this.modify || this.originValue
    },
    jsonValue () {
      return this.parseToJson()
    },
    renderValue () {
      return this.view ? this.jsonValue : this.currValue
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
      const jsonObj = JSON.parse(this.currValue)
      if (jsonObj) {
        return JSON.stringify(jsonObj, null, 2)
      }
      return this.currValue
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
