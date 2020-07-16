<template>
  <split-resize
    class="ys-mysql-database"
    :asideWidth="150"
    :vertical="true"
    :autoStart="true"
    @change="(w) => { currTableHeight = w - 100 }"
  >
    <h3>Mysql 实例: {{ instanceName }}</h3>
    <a-directory-tree
      class="ys-mysql-database--tree"
      v-bind="options"
      @select="selectNode"
    />
    <template #aside>
      <a-empty v-if="!currTableName" description="选择上面的表可以在此处展示表结构" />
      <div class="table-field-info" v-else>
        <p>{{ currTableName }}</p>
        <a-table
          class="mini-row-table"
          size="small"
          :bordered="true"
          rowKey="uid"
          :scroll="{x: 1000, y: currTableHeight}"
          :columns="columns"
          :dataSource="tableFields"
        />
      </div>
    </template>
  </split-resize>
</template>

<script>
import { dbs, tables, fields } from '@/api/mysql-query'
import SplitResize from '@/components/split-resize'
import { mapGetters } from 'vuex'
import { genHorizontalScroll } from '@/utils/util'
const hScroll = genHorizontalScroll()
export default {
  components: {
    SplitResize
  },
  data () {
    const columns = [
      { title: 'Field', dataIndex: 'Field', width: 200 },
      { title: 'Type', dataIndex: 'Type', width: 90 },
      { title: 'Key', dataIndex: 'Key', width: 40 },
      { title: 'Null', dataIndex: 'Null', width: 40 },
      { title: 'Extra', dataIndex: 'Extra' },
      { title: '默认', dataIndex: 'Default' },
      { title: '权限', dataIndex: 'Privileges' },
      { title: '字符集', dataIndex: 'Collation' },
      { title: '注释', dataIndex: 'Comment' },
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
      },
      currTableHeight: 50
    }
  },
  computed: {
    instId () {
      return Number(this.$route.params.instance_id)
    },
    ...mapGetters(['resourceMap']),
    instanceName () {
      const inst = this.resourceMap['mysql'] && this.resourceMap['mysql'][this.instId]
      return inst && inst.name
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
  beforeDestroy () {
    hScroll.remove()
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
        fields({
          inst_id: this.instId,
          db_name: node.dataRef.db,
          tb_name: node.dataRef.name
        }).then((result) => {
          this.tableFields = result
          this.setFields()
        })
        hScroll.remove()
        this.$nextTick(() => {
          hScroll.add(
            this.$el.querySelector('.ant-table-wrapper'),
            this.$el.querySelector('.ant-table-body')
          )
        })
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
