<template>
  <a-directory-tree
    class="ys-database-tree"
    v-bind="options"
    @select="selectNode"
  />
</template>

<script>
import { dbs, tables } from '@/api/mysql-query'
export default {
  data () {
    return {
      currMysqlObject: null,
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
      if (node.level === 1) {
        this.$emit('set-db', node.dataRef)
      }
    }
  }
}
</script>

<style scoped>
.ys-database-tree {
  overflow-y: auto;
  height: 100%;
  overflow-x: hidden;
}
</style>
