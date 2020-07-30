<template>
  <split-resize class="container" :asideWidth="450">
    <template #aside>
      <database-tree
        type="MongoDB"
        @set-db="setDB"
        @init-db="initDB"
        @set-fields="(f) => currFields = f"
        :api="dbApi"
      />
    </template>
    <multi-pane v-if="currDatabase">
      <span slot="title">{{ currDatabase && currDatabase.name }}</span>
      <template #default="scopedProps">
        <query-area
          v-bind="scopedProps"
          :instId="instId"
          :databases="databases"
          :fields="currFields"
          :database="currDatabase"
        />
      </template>
    </multi-pane>
    <div class="empty" v-else>
      <a-empty description="请在左侧选择数据库" />
    </div>
  </split-resize>
</template>

<script>
import { dbs, tables, indexes } from '@/api/mongodb-query'
import QueryArea from '../components/panel'
import MultiPane from '../../components/multi-pane'
import DatabaseTree from '../../components/database'
import SplitResize from '@/components/split-resize'
export default {
  components: {
    SplitResize,
    QueryArea,
    DatabaseTree,
    MultiPane
  },
  beforeRouteEnter (to, from, next) {
    if (/\d+/.test(to.params.instance_id)) {
      next()
    } else {
      next({ name: 'queryPgsqlInstances' })
    }
  },
  data () {
    return {
      currDatabase: null,
      currFields: [],
      databases: [],
      dbApi: {
        dbs, tables, indexes
      },
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
.container {
  height: 100%;
}

.empty {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
