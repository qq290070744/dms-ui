<template>
  <split-resize class="mysql-query-container" :asideWidth="450">
    <template #aside>
      <database-tree @set-db="setDB" @init-db="initDB" @set-fields="(f) => currFields = f"></database-tree>
    </template>
    <query-area v-if="currDatabase" :instId="instId" :databases="databases" :fields="currFields" :database="currDatabase"></query-area>
    <div class="empty" v-else>
      <a-empty description="请在左侧选择数据库" />
    </div>
  </split-resize>
</template>

<script>
import QueryArea from './query-area'
import DatabaseTree from './database'
import SplitResize from '@/components/split-resize'
export default {
  components: {
    SplitResize,
    QueryArea,
    DatabaseTree
  },
  beforeRouteEnter (to, from, next) {
    if (/\d+/.test(to.params.instance_id)) {
      next()
    } else {
      next({ name: 'queryMysqlInstances' })
    }
  },
  data () {
    return {
      currDatabase: null,
      currFields: [],
      databases: []
    }
  },
  computed: {
    instId () {
      return Number(this.$route.params.instance_id)
    }
  },
  methods: {
    setDB (db) {
      this.currDatabase = db
    },
    initDB (dbs) {
      this.databases = dbs
    }
  }
}
</script>

<style lang="less" scoped>
.mysql-query-container {
  height: 100%;
}
.mysql-key {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 400px;
  &--function-area, &--title {
    padding: 0 8px;
  }
}
.ant-row {
  margin-top: 8px;
}
.empty {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
