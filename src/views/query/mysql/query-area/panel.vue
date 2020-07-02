<template>
  <split-resize class="ys-query-panel" :vertical="true" :autoStart="true" :asideWidth="450">
    <monaco-editor
      language="mysql"
      :height="450"
      ref="editor"
      :suggestions="suggestions"
      @ctrl-enter="query"
      @change="lastCheck.valid = false"></monaco-editor>
    <template #aside>
      <div class="main">
        <div :class="['function-row', {'has-result': resultRecords}]">
          <a-button type="danger" @click="beauty">美化</a-button>
          <template v-if="inQuery">
            <a-popover v-model="suggestion.visible" title="优化建议" trigger="click">
              <v-markdown :source="suggestion.content" slot="content" class="ys-suggestions"></v-markdown>
              <a-button type="primary" @click="clickSuggestions">优化建议</a-button>
            </a-popover>
            <a-button type="primary" @click="clickQuery" :loading="querying">查询</a-button>
            <span class="query-time" v-if="latency">查询耗时：{{ latency }}</span>
            <span class="query-time" v-if="resultRecords">总数据量：{{ resultRecords.length }}</span>
          </template>
          <template v-else>
            <a-button type="danger" @click="clickCheck">检查语句</a-button>
            <a-button type="primary" v-if="inDDL" @click="clickMergeAlter">Alter 语句合并</a-button>

            <modal-trigger :disabled="!lastCheck.valid" title="提交工单" type="primary">
              <template #default="{ register }">
                <work-order-form :sql="lastCheck.sql" :register="register" :exParams="extraParams"></work-order-form>
              </template>
            </modal-trigger>
          </template>
        </div>
        <div class="result">
          <sql-result v-bind="result" :key="queryCount"></sql-result>
        </div>
      </div>
    </template>
  </split-resize>
</template>

<script>
import MonacoEditor from '@/components/monaco-editor'
import SplitResize from '@/components/split-resize'
import ModalTrigger from '../work-order-action/modal-trigger'
import WorkOrderForm from '../work-order-action/form'
import SqlResult from './result'
import { querySql } from '@/api/mysql-query'
import { beautySql, checkSql, mergeAlterSql, sqlSuggestions } from '@/api/work-order'
import { MYSQL_DML_TYPE, MYSQL_DDL_TYPE } from '../../utils'
import VMarkdown from 'vue-markdown'

export default {
  components: {
    MonacoEditor,
    SplitResize,
    SqlResult,
    ModalTrigger,
    WorkOrderForm,
    VMarkdown
  },
  props: {
    databases: {
      type: Array,
      default () { return [] }
    },
    database: {
      type: Object,
      default: null
    },
    fields: {
      type: Array,
      default () { return [] }
    },
    instId: {
      type: Number,
      default: 0
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
      lastCheck: {
        sql: '',
        valid: false
      },
      suggestion: {
        visible: false,
        sql: '',
        content: ''
      }
    }
  },
  computed: {
    suggestions () {
      const fds = ['字段', this.fields]
      const dbs = ['库', this.databases.map(db => db.name)]
      const dbn = this.database ? this.database.name : ''
      const tbs = [dbn + '表', this.database ? this.database.children.map(tb => tb.name) : []]
      return [dbs, tbs, fds]
    },
    resultRecords () {
      return this.result.records
    },
    latency () {
      const latency = this.result.latency
      return typeof latency === 'number' ? (latency + '毫秒') : null
    },
    extraParams () {
      const map = { DDL: MYSQL_DDL_TYPE, DML: MYSQL_DML_TYPE }
      return {
        db_name: this.database.name,
        inst_id: this.instId,
        type: map[this.type]
      }
    },
    inDDL () {
      return this.type === 'DDL'
    },
    inQuery () {
      return !(['DDL', 'DML'].includes(this.type))
    }
  },
  methods: {
    genParams (sql) {
      return { db_name: this.database.name, inst_id: this.instId, sql }
    },
    getValue () {
      const editorVm = this.$refs.editor
      return editorVm ? editorVm.getValue() : ''
    },
    clickQuery () {
      const sql = this.getValue()
      this.query(sql)
    },
    query (sql) {
      if (this.querying) {
        return
      }
      if (/^\s*$/.test(sql)) {
        this.$message.warning('请输入 Mysql 查询语句进行查询')
        return
      }
      this.querying = true
      querySql(
        this.genParams(sql)
      )
        .then((result) => {
          this.queryCount++
          this.result = result
        })
        .finally(() => {
          this.querying = false
        })
    },
    clickCheck () {
      const sql = this.getValue()

      if (/^\s*$/.test(sql)) {
        this.$message.warning(`请输入 Mysql ${this.type} 语句进行提交`)
        return
      }
      checkSql(this.genParams(sql)).then(result => {
        this.queryCount++
        this.result = result
        this.lastCheck = { sql, valid: true }
      }, (result) => {
        this.queryCount++
        this.result = result
        this.lastCheck = { sql, valid: false }
      })
    },
    clickMergeAlter () {
      const sql = this.getValue()
      mergeAlterSql({ sql }).then((result) => {
        this.$refs.editor.setValue(result)
      })
    },
    beauty () {
      const sql = this.getValue()
      beautySql({ sql }).then((result) => {
        this.$refs.editor.setValue(result)
      })
    },
    clickSuggestions () {
      const sql = this.getValue()
      if (this.suggestion.sql === sql) {
        this.suggestion.visible = true
        return
      }
      sqlSuggestions(this.genParams(sql)).then((result) => {
        this.suggestion.content = result
        this.suggestion.visible = true
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
.ys-suggestions {
  padding: 8px;
  width: 400px;
  max-height: 400px;
  overflow: auto;
}

::v-deep .split-resize--aside {
  overflow: auto;
}
</style>
