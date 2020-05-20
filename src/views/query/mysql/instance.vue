<template>
  <split-resize class="mysql-query-container" :asideWidth="200">
    <template #aside>
      <a-tree :load-data="onLoadData" :treeData="dataSource" rowKey="uid" :replaceFields="replaceFields"/>
    </template>
    <div>123123123123123</div>
  </split-resize>
</template>

<script>
import SplitResize from '@/components/split-resize'
import { dbs, tables } from '@/api/mysql-query'
export default {
  components: {
    SplitResize
  },
  beforeRouteEnter (to, from, next) {
    // console.log()
    if (/\d+/.test(to.params.instance_id)) {
      next((vm) => {
        vm.onLoadData()
      })
    } else {
      next({ name: 'queryMysqlInstances' })
    }
  },
  data () {
    return {
      currMysqlObject: null,
      dataSource: [],
      replaceFields: {
        title: 'name',
      },
    }
  },
  computed: {
    instId () {
      return Number(this.$route.params.instance_id)
    }
  },
  methods: {
    onLoadData (treeNode) {
      if (!treeNode) {
        dbs({ inst_id: this.instId }).then((result) => {
          this.dataSource = result
        })
        return
      }

      return new Promise((resolve) => {
        if (treeNode.dataRef.level === 1) {
          tables({ inst_id: this.instId, db_name: treeNode.dataRef.name }).then((result) => {
            treeNode.dataRef.children = result
            this.treeData = [...this.treeData]
            resolve()
          })
        } else {
          resolve()
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.mysql-query-container {
  height: 100%;
}
.mysql-key {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 400px;
  &--function-area, &--title {
    padding: 0 8px;
  }
}
.ant-row {
  margin-top: 8px;
}
</style>
