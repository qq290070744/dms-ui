<template>
  <type-content class="redis-value-string">
    <div slot="function">
      <label for="">查看方式：</label><a-select v-model="view" :options="views" size="small"></a-select>
      <work-order-action
        :disabled="!modify && !modifiedTtl"
        :extraParams="extraParams"
        :genActionObject="genActionObject"
        @success="onSuccess"
        title="创建工单"
      />
    </div>
    <div class="redis-value-string--content">
      <editable-cell :value="renderValue" @update:status="onChange" :key="refresh"></editable-cell>
    </div>
  </type-content>
</template>

<script>
import EditableCell from './editable-cell'
import TypeContent from './type-content'
import WorkOrderAction from '../../work-order-action'
import { defaultRedisObject } from '../../../utils'
import { genActions } from './gen-cmd'
import { DMS_ORDER_TYPE } from '@/utils/const'
export default {
  components: {
    WorkOrderAction,
    EditableCell,
    TypeContent
  },
  props: {
    redisObject: {
      default: defaultRedisObject,
      type: Object
    },
    modifiedTtl: {
      type: [Number, String],
      default: null
    }
  },
  data () {
    return {
      REDIS_TYPE: DMS_ORDER_TYPE.Redis,
      refresh: 0,
      modify: '',
      view: 0,
      views: [{ value: 0, label: 'text' }, { value: 1, label: 'json' }]
    }
  },
  computed: {
    originValue () {
      return this.redisObject && this.redisObject.value
    },
    jsonValue () {
      return this.parseToJson()
    },
    renderValue () {
      return this.view ? this.jsonValue : this.originValue
    },
    extraParams () {
      if (this.redisObject) {
        const { instId, dbName } = this.redisObject
        return {
          inst_id: instId,
          db_name: dbName,
          type: this.REDIS_TYPE
        }
      }
      return {}
    },
  },
  methods: {
    onChange (_s, value) {
      this.modify = value
    },
    parseToJson () {
      try {
        const jsonObj = JSON.parse(this.originValue)
        return JSON.stringify(jsonObj, null, 2)
      } catch (e) {
        return this.originValue
      }
    },
    genActionObject () {
      return genActions('string', {
        key: this.redisObject.key,
        modified: this.modify ? { value: this.modify, oldValue: this.originValue } : undefined,
        ttl: this.modifiedTtl
      })
    },
    onSuccess () {
      this.modify = ''
      this.refresh++
    }
  }
}
</script>

<style lang="less">
.redis-value-string {
  &--content {
    height: 100%;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 4px 11px;
  }
}
</style>
