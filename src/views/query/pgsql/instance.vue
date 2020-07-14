<template>
  <split-resize class="container" :asideWidth="450">
    <template #aside>
      <database-tree
        type="PgSQL"
        @set-db="setDB"
        @init-db="initDB"
        @set-fields="(f) => currFields = f"
        :api="dbApi"
        :fields="fields"
      />
    </template>
    <multi-pane v-if="currDatabase" :fixedPanes="panes">
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
import { dbs, tables, fields } from '@/api/pgsql-query'
import QueryArea from './query-area/panel'
import MultiPane from '../components/multi-pane'
import DatabaseTree from '../components/database'
import SplitResize from '@/components/split-resize'
import { DMS_INSTANCE_TYPE } from '@/utils/const'
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
      panes: [
        { key: DMS_INSTANCE_TYPE.PgSQL, title: '工单窗口', fixed: true },
      ],
      currDatabase: null,
      currFields: [],
      databases: [],
      dbApi: {
        dbs, tables, fields
      },
      fields: [
        { title: 'Field', dataIndex: 'field', width: 60 },
        { title: 'Type', dataIndex: 'type', width: 60 },
        { title: 'Attnum', dataIndex: 'attnum', width: 60 },
        { title: 'Length', dataIndex: 'length', width: 60 },
        { title: 'LengthVar', dataIndex: 'lengthvar', width: 60 },
        { title: 'NotNull', dataIndex: 'notnull', width: 60 },
        { title: 'Comment', dataIndex: 'comment', width: 300 },
      ]
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
