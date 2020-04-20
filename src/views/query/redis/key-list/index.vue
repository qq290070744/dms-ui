<template>
  <div class="redis-key">
    <p class="redis-key--title">对象列表</p>
    <div class="redis-key--function-area">
      <a-row :gutter="8">
        <a-col :span="18">
          <a-select :options="redis.list" v-model="redis.db" @change="loadData(searchStr)" size="small" style="width: 100%"></a-select>
        </a-col>
        <a-col :span="6">总数：{{ table.dataSource.length }}</a-col>
      </a-row>
      <a-row :gutter="8">
        <a-col :span="18">
          <a-input-search placeholder="输入关键字，按回车搜索" v-model="searchStr" @pressEnter="loadData(searchStr)" size="small"></a-input-search>
        </a-col>
        <a-col :span="6">
          <a-checkbox v-model="exactSearch">精确搜索</a-checkbox>
        </a-col>
      </a-row>
    </div>
    <redis-content-key-list :tableOptions="table" @row-change="queryValue" @on-change="queryKeyType"></redis-content-key-list>
  </div>
</template>

<script>
import RedisContentKeyList from './content-list'
import * as redisApi from '@/api/redis-query'
import { defaultRedisObject } from '../utils'
const genDBList = () => {
  return Array(255).fill(1).map((_v, i) => ({ value: i, label: 'DB' + i }))
}
export default {
  components: {
    RedisContentKeyList
  },
  data () {
    return {
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
    instId () {
      return Number(this.$route.params.instance_id)
    }
  },
  mounted () {
    this.loadData()
  },
  methods: {
    loadData (pattern) {
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
    queryKeyType (page, pageSize) {
      const start = (page - 1) * pageSize
      const keys = this.table.dataSource.slice(start, pageSize)

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
      const dbName = this.redis.db
      const instId = this.instId
      const params = {
        db_name: this.redis.db,
        inst_id: this.instId,
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
        data.ttl = v.ttl
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
