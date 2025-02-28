<template>
  <div class="redis-key">
    <h3>Redis 实例: {{ instanceName }}</h3>
    <div class="redis-key--function-area">
      <a-row :gutter="8">
        <a-col :span="18">
          <a-select :options="redis.list" v-model="redis.db" @change="loadData(searchStr)" size="small" style="width: 100%"></a-select>
        </a-col>
        <a-col :span="6">总数：{{ redisTotol }}</a-col>
      </a-row>
      <a-row :gutter="8">
        <a-col :span="18">
          <a-input placeholder="输入关键字，点击下面按钮搜索" v-model="searchStr" size="small"></a-input>
        </a-col>
        <a-col :span="6">
          <a-checkbox v-model="exactSearch">精确搜索</a-checkbox>
        </a-col>
      </a-row>
    </div>
    <redis-content-key-list
      :tableOptions="table"
      :extra-params="connection"
      @create="startCreate"
      @row-change="queryValue"
      @page-change="queryKeyType"
      :search="() => loadData(searchStr)"
    />
  </div>
</template>

<script>
import RedisContentKeyList from './content-list'
import * as redisApi from '@/api/redis-query'
import { defaultRedisObject } from '../../utils'
import { DMS_ORDER_TYPE } from '@/utils/const'
import { mapGetters } from 'vuex'
const genDBList = () => {
  return Array(50).fill(1).map((_v, i) => ({ value: i, label: 'DB' + i }))
}
export default {
  components: {
    RedisContentKeyList
  },
  data () {
    return {
      REDIS_TYPE: DMS_ORDER_TYPE.Redis,
      redisTotol: 0,
      redis: {
        db: 0,
        list: genDBList()
      },
      exactSearch: false,
      searchStr: '',
      table: {
        dataSource: [],
        pagination: {
          defaultPageSize: 50
        }
      }
    }
  },
  computed: {
    ...mapGetters(['resourceMap']),
    instanceName () {
      const inst = this.resourceMap.redis && this.resourceMap.redis[this.instId]
      return inst && inst.name
    },
    instId () {
      return Number(this.$route.params.instance_id)
    },
    connection () {
      return {
        db_name: this.redis.db,
        inst_id: this.instId,
        type: this.REDIS_TYPE
      }
    }
  },
  mounted () {
    this.loadData()
  },
  methods: {
    startCreate () {
      const dbName = this.redis.db
      const instId = this.instId

      const data = { ...defaultRedisObject(), type: 'string', dbName, instId, temp: true }
      this.$emit('value-change', data)
    },
    loadData (pattern) {
      this.queryCount()
      const parameter = {
        db_name: this.redis.db,
        inst_id: this.instId,
        exact: this.exactSearch,
        pattern: pattern || '*',
      }
      return redisApi.search(parameter)
        .then(result => {
          if (!result) {
            result = []
          }
          this.table.dataSource = result.map(key => ({ key, type: '' }))
          this.queryKeyType(1, this.table.pagination.defaultPageSize)
          // this.$nextTick(() => {
          //   this.initTableHeight()
          // })
        })
    },
    queryCount () {
      redisApi.size({
        db_name: this.redis.db,
        inst_id: this.instId
      }).then((data) => {
        this.redisTotol = data.total
      })
    },
    queryKeyType (page, pageSize) {
      const start = (page - 1) * pageSize
      const keys = this.table.dataSource.slice(start, start + pageSize)

      const filterKeys = keys.map((keyObj, i) => ({ ...keyObj, i: start + i })).filter(keyObj => !keyObj.type)
      if (filterKeys.length) {
        const targetKeys = filterKeys.map(keyObj => keyObj.key)
        const indexMap = filterKeys.reduce((m, c) => {
          m[c.key] = c.i
          return m
        }, {})
        const params = {
          keys: targetKeys,
          db_name: this.redis.db,
          inst_id: this.instId,
        }
        redisApi.types(params).then((data) => {
          if (data) {
            Object.keys(data).forEach(key => {
              const targetKeyObj = this.table.dataSource[indexMap[key]]
              this.$set(targetKeyObj, 'type', data[key])
            })
          }
        })
      }
    },
    queryValue (record) {
      if (!record) {
        this.$emit('value-change', null)
        return
      }
      const dbName = this.redis.db
      const instId = this.instId
      const params = {
        ...this.connection,
        ...record
      }

      redisApi.key(params).then((data = {}) => {
        data = { ...defaultRedisObject(), ...data, dbName, instId }
        this.$emit('value-change', data)
        this.queryTTL(data)
      })
    },
    queryTTL (data) {
      redisApi.ttl({ key: data.key, inst_id: data.instId, db_name: data.dbName }).then((v) => {
        data.ttl = v.ttl + ''
        this.$emit('value-change', data)
      })
    }
  }
}
</script>

<style scoped lang="less">
.redis-key {
  padding: 8px;
}
</style>
