<template>
  <split-resize class="ys-query-panel" :vertical="true" :autoStart="true" :asideWidth="500">
    <monaco-editor
      language="json"
      :height="450"
      ref="editor"
      @change="lastCheck.valid = false"
    />
    <template #aside>
      <div class="main">
        <div class="function-row">
          <query-form :tables="tables" @query="query" :loading="querying"></query-form>
          <span class="query-time" v-if="latency">查询耗时：{{ latency }}</span>
          <span class="query-time" v-if="resultRecords">总数据量：{{ resultRecords.length }}</span>
        </div>
        <div class="result" :class="['result', {'has-result': resultRecords}]">
          <sql-result :result="result.records" />
        </div>
      </div>
    </template>
  </split-resize>
</template>

<script>
import MonacoEditor from '@/components/monaco-editor'
import SplitResize from '@/components/split-resize'
import SubmitWorkorder from '../../components/work-order-action/main'
import SqlResult from './result.jsx'
import { DMS_INSTANCE_TYPE } from '@/utils/const'

import { querySql } from '@/api/mongodb-query'
import QueryForm from './query-form'
import ApplyExport from '@/views/work-order/exports/apply'

export default {
  components: {
    MonacoEditor,
    SplitResize,
    SqlResult,
    ApplyExport,
    SubmitWorkorder,
    QueryForm
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
    tables () {
      return this.database.children.map(t => ({ value: t.name, label: t.name }))
    },
    inQuery () {
      return this.type !== DMS_INSTANCE_TYPE.PgSQL
    },
    exportParams () {
      return { db_name: this.database.name, inst_id: this.instId, command: this.lastQuery }
    }
  },
  methods: {
    getValue () {
      const editorVm = this.$refs.editor
      try {
        const value = editorVm ? editorVm.getValue() : ''
        return JSON.parse(value)
      } catch (e) {
        return {}
      }
    },
    buildSql (params) {
      const sql = this.getValue()
      if (/^\s*$/.test(sql)) {
        this.$message.warning(`请输入语句再进行提交`)
        return
      }
      return {
        ...params,
        condition: sql,
        db_name: this.database.name,
        inst_id: this.instId
      }
    },
    clickQuery (params) {
      const sql = this.getValue()
      this.query(sql, params)
      this.buildSql(params)
    },
    query (params) {
      if (!this.inQuery || this.querying) {
        return
      }
      params = this.buildSql(params)
      this.querying = true
      querySql(params)
        .then((result) => {
          this.lastQuery = params.sql
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
.ys-query-panel {
  // relative to a-tabs
  position: absolute;
  top: 50px;
  height: calc(100% - 50px);
  .result {
    overflow: auto;
    &.has-result {
      margin-top: -26px;
    }
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
    vertical-align: middle;
    position: relative;
    z-index: 1;
  }
  .query-time {
    margin-top: 10px;
    margin-left: 8px;
    display: inline-block;
    vertical-align: middle;
  }
}
::v-deep .split-resize--aside {
  overflow: auto;
}
::v-deep {
  .ant-pagination.mini.ant-table-pagination {
    position: relative;
    z-index: 10;
  }
  .ant-table-thead > tr > th {
    border-bottom: 2px solid #e8e8e8;
  }
}
</style>
