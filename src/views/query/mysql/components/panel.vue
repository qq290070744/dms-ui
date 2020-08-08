<template>
  <split-resize class="ys-query-panel" :vertical="true" :autoStart="true" :asideWidth="500">
    <monaco-editor
      language="mysql"
      :height="450"
      ref="editor"
      :suggestions="suggestions"
      @ctrl-enter="query"
      @change="lastCheck.valid = false"
    />
    <template #aside>
      <div class="main">
        <div :class="['function-row', {'has-result': resultRecords}]">
          <beauty-action :params="buildSql" :cb="setValue" />
          <template v-if="inQuery">
            <suggestion-action
              :params="buildSql"
            />
            <a-button
              type="primary"
              size="small"
              @click="clickQuery"
              :loading="querying"
            >查询</a-button>
            <apply-export
              v-show="resultRecords && exportParams"
              :extra="exportParams"
            />
            <span class="query-time" v-if="latency">查询耗时：{{ latency }}</span>
            <span class="query-time" v-if="resultRecords">总数据量：{{ resultRecords.length }}</span>
          </template>
          <template v-else>
            <check-action :params="buildSql" :cb="afterChecked" />
            <merge-action
              v-if="inDDL"
              :params="buildSql"
              :cb="setValue"
            />
            <submit-workorder
              :sql="lastCheck.sql"
              :extra="extraParams"
              :disabled="!lastCheck.valid"
            />
          </template>
        </div>
        <div class="result">
          <sql-result v-bind="result" :key="queryCount" />
        </div>
      </div>
    </template>
  </split-resize>
</template>

<script>
import MonacoEditor from '@/components/monaco-editor'
import SplitResize from '@/components/split-resize'
import SubmitWorkorder from '../../components/work-order-action/main'
import SqlResult from '../../components/result.jsx'
import {
  BeautyAction,
  MergeAction,
  CheckAction,
  SuggestionAction
} from '../../components/actions'
import { querySql } from '@/api/mysql-query'
import ApplyExport from '@/views/work-order/exports/apply'
import { DMS_ORDER_TYPE } from '@/utils/const'

const MYSQL_DML_TYPE = DMS_ORDER_TYPE['MySQL-DML']
const MYSQL_DDL_TYPE = DMS_ORDER_TYPE['MySQL-DDL']
export default {
  components: {
    MonacoEditor,
    SplitResize,
    SqlResult,
    ApplyExport,
    SubmitWorkorder,
    BeautyAction,
    CheckAction,
    MergeAction,
    SuggestionAction
  },
  props: {
    suggestions: {
      type: Array,
      default () { return [] }
    },
    database: {
      type: Object,
      default: null
    },
    type: {
      type: String,
      default: 'query'
    }
  },
  data () {
    return {
      result: {},
      queryCount: 0,
      querying: false,
      lastQuery: '',
      lastCheck: {
        sql: '',
        valid: false
      }
    }
  },
  computed: {
    instId () {
      return Number(this.$route.params.instance_id)
    },
    resultRecords () {
      return this.result.records
    },
    latency () {
      const latency = this.result.latency
      return typeof latency === 'number' ? (latency + '毫秒') : null
    },
    extraParams () {
      return {
        db_name: this.database.name,
        inst_id: this.instId,
        type: this.type
      }
    },
    inDDL () {
      return this.type === MYSQL_DDL_TYPE
    },
    inQuery () {
      return !([MYSQL_DDL_TYPE, MYSQL_DML_TYPE].includes(this.type))
    },
    exportParams () {
      return { db_name: this.database.name, inst_id: this.instId, command: this.lastQuery }
    }
  },
  methods: {
    getValue () {
      const editorVm = this.$refs.editor
      return editorVm ? editorVm.getValue() : ''
    },
    setValue (value) {
      this.$refs.editor.setValue(value)
    },
    buildSql () {
      const sql = this.getValue()
      if (/^\s*$/.test(sql)) {
        this.$message.warning(`请输入语句再进行提交`)
        return
      }
      return {
        sql,
        db_name: this.database.name,
        inst_id: this.instId
      }
    },
    afterChecked (result, params, valid) {
      const sql = params.sql
      this.queryCount++
      this.result = result
      this.lastCheck = { sql, valid }
    },
    clickQuery () {
      const sql = this.getValue()
      this.query(sql)
    },
    query (sql) {
      if (!this.inQuery || this.querying) {
        return
      }
      const params = this.buildSql()
      this.querying = true
      querySql(params)
        .then((result) => {
          this.lastQuery = sql
          this.queryCount++
          this.result = result || {}
        })
        .finally(() => {
          this.querying = false
        })
    }
  }
}
</script>

<style scoped lang="less">
.ys-query-panel.split-resize {
  // relative to a-tabs
  position: absolute;
  top: 30px;
  height: calc(100% - 30px);
  .result {
    overflow: auto;
    margin-top: 16px;
  }
  .ys-monaco-editor {
    margin: 0 8px;
  }
  .main {
    padding: 0 8px;
    position: relative;
  }
  .function-row {
    padding: 0 8px;
    margin: 8px 0;
    &.has-result {
      position: absolute;
      z-index: 10;
      top: -5px;
      margin-top: 0;
    }
  }
  .query-time {
    margin-left: 8px;
  }
}
::v-deep .split-resize--aside {
  overflow: auto;
}
</style>
