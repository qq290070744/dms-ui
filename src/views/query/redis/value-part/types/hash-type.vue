<template>
  <type-content class="redis-value-hash">
    <a-table :columns="columns" :dataSource="currValue" rowKey="field" size="small" bordered>
      <template #index="text, record, index">
        <span>{{ index + 1 }}</span>
      </template>
      <template #field="text, record">
        <editable-cell :value="record.field"></editable-cell>
      </template>
      <template #value="text">
        <editable-cell :value="text"></editable-cell>
      </template>
    </a-table>
  </type-content>
</template>

<script>
import EditableCell from './editable-cell'
import TypeContent from './type-content'
import { defaultRedisObject } from '../../utils'
export default {
  components: {
    TypeContent,
    EditableCell
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
      columns: [{
        title: '序号',
        width: 60,
        scopedSlots: { customRender: 'index' }
      }, {
        title: 'Field',
        dataIndex: 'field',
        scopedSlots: { customRender: 'field' }
      }, {
        title: 'Value',
        dataIndex: 'value',
        scopedSlots: { customRender: 'value' }
      }]
    }
  },
  computed: {
    originValue () {
      return this.redisObject ? this.redisObject.value : {}
    },
    currValue () {
      return Object.keys(this.originValue).map(key => ({ field: key, value: this.originValue[key] }))
    }
  },
  methods: {
    onChange (e) {
      console.log(e)
    },
    submit () {
      // 未检测到修改，无需提交。
      // key: devops:test:string:key:2  value: test1 dbName: 1
    }
  }
}
</script>
