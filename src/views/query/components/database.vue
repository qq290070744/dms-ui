<template>
  <split-resize
    class="ys-mysql-database"
    :asideWidth="280"
    :vertical="true"
    :autoStart="true"
    @change="(w) => { currTableHeight = w - 150 }"
  >
    <h3>{{ type }} 实例 | {{ instanceName }}</h3>
    <a-directory-tree
      class="ys-mysql-database--tree"
      v-bind="options"
      @select="selectNode"
    />
    <template #aside>
      <a-empty v-if="!currTableInfo" description="选择上面的表可以在此处展示表结构" />
      <template v-else>
        <div class="table-field-info" v-if="COLUMN_FIELDS[type] && api.fields">
          <p>{{ currTableInfo }}表字段信息 <table-create-info :params="currTable"></table-create-info></p>
          <table-info
            rowKey="uid"
            :scroll="{x: 1000, y: currTableHeight / 2}"
            :columns="COLUMN_FIELDS[type]"
            :dataSource="tableFields"
          />
        </div>

        <div class="table-field-info" v-if="COLUMN_INDEXES[type] && api.indexes">
          <p>{{ currTableInfo }}表索引信息</p>
          <table-info
            rowKey="uid"
            :scroll="{x: 1000, y: currTableHeight / 2}"
            :columns="COLUMN_INDEXES[type]"
            :dataSource="tableIndexes"
          />
        </div>
      </template>
    </template>
  </split-resize>
</template>

<script>
import SplitResize from '@/components/split-resize'
import { mapGetters } from 'vuex'
import TableInfo from './table-info'
import TableCreateInfo from './table-create-info'
import { COLUMN_INDEXES, COLUMN_FIELDS } from './columns'
export default {
  components: {
    SplitResize,
    TableInfo,
    TableCreateInfo
  },
  props: {
    api: {
      default: () => ({}),
      required: true,
      type: Object
    },
    type: {
      type: String,
      default: 'MySQL'
    },
    fields: {
      type: Array,
      default: null
    }
  },
  data () {
    return {
      COLUMN_INDEXES,
      COLUMN_FIELDS,
      selectedTable: null,
      tableFields: [],
      tableIndexes: [],
      options: {
        treeData: [],
        replaceFields: {
          title: 'name',
        },
        blockNode: true,
        loadData: this.onLoadData,
        rowKey: 'uid'
      },
      currTableHeight: 150,
      currTable: {}
    }
  },
  computed: {
    instId () {
      return Number(this.$route.params.instance_id)
    },
    ...mapGetters(['resourceMap']),
    instanceName () {
      const type = this.type.toLowerCase()
      const inst = this.resourceMap[type] && this.resourceMap[type][this.instId]
      return inst && inst.name
    },
    currTableInfo () {
      if (!this.selectedTable) {
        return ''
      }
      const { db, name } = this.selectedTable
      return `${db}.${name} `
    }
  },
  mounted () {
    this.onLoadData()
  },
  methods: {
    onLoadData (treeNode) {
      if (!treeNode && this.instId) {
        this.api.dbs({ inst_id: this.instId }).then((result) => {
          this.options.treeData = result
          this.$emit('init-db', result)
        })
        return
      }

      return new Promise((resolve) => {
        if (treeNode.dataRef.level === 1) {
          this.$emit('set-db', treeNode.dataRef)
          this.api
            .tables({
              inst_id: this.instId,
              db_name: treeNode.dataRef.name
            })
            .then((result) => {
              treeNode.dataRef.children = result
              this.options.treeData = [...this.options.treeData]
              resolve()
            })
        } else {
          resolve()
        }
      })
    },
    selectNode (_s, { node }) {
      const level = node.dataRef.level
      if (level === 1) {
        this.$emit('set-db', node.dataRef)
      } else if (level === 2) {
        this.selectedTable = node.dataRef
        const currTable = {
          inst_id: this.instId,
          db_name: node.dataRef.db,
          tb_name: node.dataRef.name
        }
        this.currTable = currTable
        if (this.api.fields) {
          this.api
            .fields(currTable).then((result) => {
              this.tableFields = result
              this.setFields()
            })
        }
        if (this.api.indexes) {
          this.api
            .indexes(currTable).then((result) => {
              this.tableIndexes = result
            })
        }
      }
    },
    setFields () {
      const fieldnames = this.tableFields.map(item => item.Field)
      this.$emit('set-fields', fieldnames)
    }
  }
}
</script>

<style scoped lang="less">
.ys-mysql-database {
  padding: 0 4px;
}
.ys-mysql-database--tree {
  height: 100%;
  padding-bottom: 40px;
  overflow: auto;
}
</style>
