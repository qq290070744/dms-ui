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
    <multi-pane v-if="currDatabase" :tips="true" :fixedPanes="panes">
      <span slot="title">{{ currDatabase && currDatabase.name }}</span>
      <template #default="scopedProps">
        <query-area
          v-bind="scopedProps"
          :suggestions="suggestions"
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
import { dbs, tables, fields, indexes } from '@/api/mysql-query'
import QueryArea from '../components/panel'
import QueryTips from '../components/tips'
import MultiPane from '../../components/multi-pane'
import DatabaseTree from '../../components/database'
import SplitResize from '@/components/split-resize'
import { DMS_ORDER_TYPE } from '@/utils/const'
import { genSuggestions } from '../../components/utils'
export default {
  name: 'QueryMysqlInstance',
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
      panes: [
        { key: DMS_ORDER_TYPE['MySQL-DDL'], title: 'DDL窗口', fixed: true },
        { key: DMS_ORDER_TYPE['MySQL-DML'], title: 'DML窗口', fixed: true },
      ],
      currDatabase: null,
      currFields: [],
      databases: [],
      dbApi: {
        dbs, tables, fields, indexes
      },
      tipsDisplayed: false
    }
  },
  computed: {
    instId () {
      return Number(this.$route.params.instance_id)
    },
    suggestions () {
      return genSuggestions(
        this.databases,
        this.currDatabase,
        this.currFields
      )
    }
  },
  methods: {
    setDB (db) {
      this.currDatabase = db
      this.showTips()
    },
    initDB (dbs) {
      this.databases = dbs
    },
    showTips () {
      if (!this.tipsDisplayed && !this.$ls.get('mysql-tips-hidden')) {
        this.tipsDisplayed = true
        this.$notification.info({
          message: '查询需知',
          description: (
            <div>
              <query-tips />
              <a-checkbox onChange={(v) => {
                this.$ls.set('mysql-tips-hidden', v.target.checked)
              }}>
                不再提示
              </a-checkbox>
            </div>
          )
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.mysql-query-container {
  height: 100%;
}

.empty {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
