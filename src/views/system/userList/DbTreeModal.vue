<template>
  <div>
    <a-modal
      title="库表授权"
      :visible="visible"
      v-if="visible"
      @ok="handleOk"
      @cancel="handleCancel"
      :confirm-loading="confirmLoading"
      width="800px"
    >
      <a-tree
        checkable
        :load-data="onLoadData"
        :tree-data="treeData"
        v-model="checkedKeys"
        @check="onCheck"
      />
    </a-modal>
  </div>
</template>

<script>
import { getDatabaseById, associatedChema, getAuthByUserId } from '@/api/userList'

export default {
  props: {
    databaseSource: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      visible: false,
      confirmLoading: false,
      userId: null,
      treeData: [],
      checkedKeys: []
    }
  },
  methods: {
    handleOpenModal(record) {
      this.visible = true
      this.userId = record.id
      getAuthByUserId({
        user_id: this.userId
      }).then(res => {
        if (res[0]) {
          this.checkedKeys = res[0].schemas[0].tables.map(item => {
            return item.key
          })
        } else {
          this.checkedKeys = []
        }
      })
    },
    handleOk() {
      this.confirmLoading = true
      const struct = this.checkedKeys.filter(
        item => item.match(/@_@/g) && item.match(/@_@/g).length === 3
      )
      associatedChema({
        user_id: this.userId,
        struct
      })
        .then(() => {
          this.$message.success('授权成功')
          this.confirmLoading = false
          this.visible = false
        })
        .catch(() => {
          this.confirmLoading = false
        })
    },
    handleCancel() {
      this.visible = false
    },
    onLoadData(node) {
      return new Promise(resolve => {
        const {
          dataRef: { children, id }
        } = node
        if (children) {
          resolve()
          return
        }
        getDatabaseById({
          inst_id: id
        }).then(res => {
          const childNode = this.dealNodeData(res.Schemas, id)
          node.dataRef.children = childNode
          this.treeData = [...this.treeData]
          resolve()
        })
      })
    },
    dealNodeData(data = [], instId) {
      const dbList = []

      data.map(item => {
        const dbObj = {
          title: item.db.name,
          key: item.db.key,
          isLeaf: true,
          treeType: 'db',
          children: []
        }
        if (item.tables && item.tables.length > 0) {
          dbObj.isLeaf = false
          item.tables.map(tbItem => {
            dbObj.children.push({
              title: tbItem.name,
              key: tbItem.key,
              isLeaf: true
            })
          })
        }
        dbList.push(dbObj)
      })
      return dbList
    },
    onCheck(checkedKeys, e) {
      this.checkedKeys = checkedKeys
    }
  },
  watch: {
    databaseSource(val) {
      const list = []
      val.map(item => {
        if (item.type === 1) {
          list.push({
            ...item,
            treeType: 'inst',
            isLeaf: item.type !== 1
          })
        }
      })
      this.treeData = list
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
