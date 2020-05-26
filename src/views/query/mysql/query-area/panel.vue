<template>
  <split-resize class="ys-query-panel" :vertical="true" :autoStart="true" :asideWidth="320">
    <monaco-editor language="mysql" :height="450" ref="editor" :suggestions="suggestions" @ctrl-enter="query"></monaco-editor>
    <template #aside>
      <div class="main">
        <div :class="['function-row', {'has-result': hasResult}]">
          <a-button type="primary" @click="clickQuery">查询</a-button>
          <a-button type="danger" @click="beauty">美化</a-button>
          <!-- <a-button>查看表结构</a-button> -->
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
import SqlResult from './result'
import { querySql } from '@/api/mysql-query'
import { beautySql } from '@/api/work-order'
export default {
  components: {
    MonacoEditor,
    SplitResize,
    SqlResult
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
    instId: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      result: {},
      queryCount: 0
    }
  },
  computed: {
    suggestions () {
      const dbs = ['库', this.databases.map(db => db.name)]
      const dbn = this.database ? this.database.name : ''
      const tbs = [dbn + '表', this.database ? this.database.children.map(tb => tb.name) : []]
      return [dbs, tbs]
    },
    hasResult () {
      return this.result.records && this.result.records.length
    }
  },
  methods: {
    genParams (sql) {
      return { db_name: this.database.name, inst_id: this.instId, sql }
    },
    getValue () {
      const editorVm = this.$refs.editor

      return editorVm ? editorVm.getValue().replace(/[\n\s\t]+/g, ' ') : ''
    },
    clickQuery () {
      const sql = this.getValue()
      this.query(sql)
    },
    query (sql) {
      if (/^\s*$/.test(sql)) {
        this.$message.warning('请输入 sql 查询语句进行查询')
        return
      }
      querySql(this.genParams(sql))
        .then((result) => {
          this.queryCount++
          this.result = result
        })
    },
    beauty () {
      const sql = this.getValue()
      beautySql({ sql }).then((result) => {
        this.$refs.editor.setValue(result)
      })
    }
  }
}
</script>

<style scoped lang="less">
.ys-query-panel {
  height: calc(100% - 60px);
  // relative to a-tabs
  position: absolute;
  top: 60px;
  .result {
    overflow: auto;
    margin-top: 16px;
  }
  .main {
    position: relative;
  }
  .function-row {
    margin: 8px 0;
    &.has-result {
      position: absolute;
      z-index: 10;
      top: -5px;
      margin-top: 0;
    }
    .ant-btn + .ant-btn {
      margin-left: 8px;
    }
  }
}

</style>
