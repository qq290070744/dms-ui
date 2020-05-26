<template>
  <split-resize :asideWidth="150" :vertical="true" :autoStart="true">
    <a-directory-tree
      class="ys-database-tree"
      v-bind="options"
      @select="selectNode"
    />
    <template #aside>
      <a-empty v-if="!currTableName" description="选择上面的表可以在此处展示表结构" />
      <div class="table-field-info" v-else>
        <p>{{ currTableName }}</p>
        <a-table size="small" :bordered="true" rowKey="uid" :columns="columns" :dataSource="tableFields"></a-table>
      </div>
    </template>
  </split-resize>
</template>

<script>
import { dbs, tables, fields } from '@/api/mysql-query'
import SplitResize from '@/components/split-resize'
export default {
  components: {
    SplitResize
  },
  data () {
    const columns = [
      { title: '字符集', dataIndex: 'Collation' },
      { title: '注释', dataIndex: 'Comment' },
      { title: '默认', dataIndex: 'Default' },
      { title: 'Extra', dataIndex: 'Extra' },
      { title: '字段', dataIndex: 'Field' },
      { title: '索引类型', dataIndex: 'Key' },
      { title: 'Null', dataIndex: 'Null' },
      { title: '权限', dataIndex: 'Privileges' },
      { title: '字段类型', dataIndex: 'Type' },
    ]
    return {
      columns,
      currMysqlObject: null,
      selectedTable: null,
      tableFields: [],
      options: {
        treeData: [],
        replaceFields: {
          title: 'name',
        },
        blockNode: true,
        loadData: this.onLoadData,
        rowKey: 'uid'
      }
    }
  },
  computed: {
    instId () {
      return Number(this.$route.params.instance_id)
    },
    currTableName () {
      if (!this.selectedTable) {
        return ''
      }
      const { db, name } = this.selectedTable
      return `${db}.${name} 表字段信息`
    }
  },
  mounted () {
    this.onLoadData()
  },
  methods: {
    onLoadData (treeNode) {
      if (!treeNode) {
        dbs({ inst_id: this.instId }).then((result) => {
          this.options.treeData = result
          this.$emit('init-db', result)
        })
        return
      }

      return new Promise((resolve) => {
        if (treeNode.dataRef.level === 1) {
          this.$emit('set-db', treeNode.dataRef)
          tables({ inst_id: this.instId, db_name: treeNode.dataRef.name }).then((result) => {
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
        fields({ inst_id: this.instId, db_name: node.dataRef.db, tb_name: node.dataRef.name }).then((result) => {
          this.tableFields = result
        })
      }
    }
  }
}
</script>

<style scoped>
.ys-database-tree, .table-field-info {
  overflow: auto;
  height: 100%;
}
</style>
