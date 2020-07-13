<template>
  <split-resize class="mysql-query-container" :asideWidth="450">
    <template #aside>
      <database-tree
        @set-db="setDB"
        @init-db="initDB"
        @set-fields="(f) => currFields = f"
        :api="dbApi"
      />
    </template>
    <multi-pane v-if="currDatabase" :tips="QueryTips" :fixedPanes="panes">
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
      <template #tips>
        <query-tips></query-tips>
      </template>
    </multi-pane>
    <div class="empty" v-else>
      <a-empty description="请在左侧选择数据库" />
    </div>
  </split-resize>
</template>

<script>
import { dbs, tables, fields } from '@/api/mysql-query'
import QueryArea from './query-area/panel'
import QueryTips from './query-area/tips'
import MultiPane from '../components/multi-pane'
import DatabaseTree from '../components/database'
import SplitResize from '@/components/split-resize'
import { DMS_ORDER_TYPE } from '@/utils/const'
export default {
  components: {
    SplitResize,
    QueryArea,
    QueryTips,
    DatabaseTree,
    MultiPane
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
      QueryTips,
      panes: [
        { key: DMS_ORDER_TYPE['MySQL-DDL'], title: 'DDL窗口', fixed: true },
        { key: DMS_ORDER_TYPE['MySQL-DML'], title: 'DML窗口', fixed: true },
      ],
      currDatabase: null,
      currFields: [],
      databases: [],
      dbApi: {
        dbs, tables, fields
      }
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
