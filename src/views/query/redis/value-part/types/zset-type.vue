<template>
  <type-content class="redis-value-hash">
    <a-table :columns="columns" :dataSource="currValue" rowKey="field" size="small" bordered>
      <template #index="text, record, index">
        <span>{{ index + 1 }}</span>
      </template>
      <template #score="text, record">
        <editable-cell :value="record.score"></editable-cell>
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
        title: 'Value',
        dataIndex: 'value',
        scopedSlots: { customRender: 'value' }
      }, {
        title: 'Score',
        dataIndex: 'score',
        scopedSlots: { customRender: 'score' }
      }]
    }
  },
  computed: {
    originValue () {
      return this.redisObject && this.redisObject.value
    },
    currValue () {
      return [{ field: '111', value: '2222222' }]
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
