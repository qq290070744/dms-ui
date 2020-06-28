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
      <SplitWindow>
        <template #aside>
          <div class="inst-wrap">
            <a-tree
              :tree-data="instTreeData"
              @select="onSelect"
              defaultExpandAll
              :default-selected-keys="defaultSelectedKeys"
            />
          </div>
        </template>
        <div class="db-wrap">
          <a-button class="select-all" type="primary" @click="handleSelectAll" v-if="treeData.length > 0">全选</a-button>
          <a-tree
            checkable
            :tree-data="treeData"
            v-model="checkedKeys"
            @check="onCheck"
          />
        </div>
      </SplitWindow>
    </a-modal>
  </div>
</template>

<script>
import SplitWindow from '@/components/split-resize'
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
      instTreeData: [],
      checkedKeys: [],
      currentInstId: null,
      defaultSelectedKeys: []
    }
  },
  components: {
    SplitWindow
  },
  methods: {
    handleOpenModal(record) {
      this.visible = true
      this.userId = record.id
      this.currentInstId = null
      this.checkedKeys = []
      this.defaultSelectedKeys = []
      this.treeData = []
    },
    handleOk() {
      this.confirmLoading = true
      const struct = this.checkedKeys.filter(
        item => item.match(/@_@/g) && item.match(/@_@/g).length === 3
      )
      associatedChema({
        user_id: this.userId,
        inst_id: this.currentInstId,
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
    },
    onSelect(checkedKeys, e) {
      const currentInstId = checkedKeys.map(Number)[0]
      if (!e.selected || currentInstId === this.currentInstId) {
        return
      }
      this.currentInstId = currentInstId
      this.fetchTreeAndResource(currentInstId)
    },
    fetchTreeAndResource(currentInstId) {
      this.checkedKeys = []
      getDatabaseById({
        inst_id: currentInstId
      }).then(res => {
        const childNode = this.dealNodeData(res.Schemas)
        this.treeData = childNode
        getAuthByUserId({
          inst_id: currentInstId,
          user_id: this.userId
        }).then(res => {
          if (res && res.length > 0) {
            const checkedKeys = []
            res.map(item => {
              if (item) {
                item.schemas.map(dbItem => {
                  dbItem.tables.map(tbItem => {
                    checkedKeys.push(tbItem.key)
                  })
                })
              }
            })
            this.checkedKeys = checkedKeys
          } else {
            this.checkedKeys = []
          }
        })
      })
    },
    handleSelectAll() {
      const selectKey = []
      this.treeData.map(item => {
        if (item.children && item.children.length > 0) {
          item.children.map(childItem => {
            selectKey.push(childItem.key)
          })
        }
      })
      this.checkedKeys = selectKey
    }
  },
  watch: {
    databaseSource(val) {
      const instList = []
      const instObj = {}
      const mapDbType = {
        1: 'mysql',
        2: 'redis',
        3: 'mongodb',
        4: 'pgsql'
      }
      val.map(item => {
        if (item.type === 1) {
          if (instObj[item.type]) {
            instList.map(instItem => {
              if (instItem.type === item.type) {
                instItem.children.push({
                  ...item,
                  treeType: 'inst',
                  isLeaf: true
                })
              }
            })
          } else {
            instList.push({
              title: mapDbType[item.type],
              key: mapDbType[item.type],
              type: item.type,
              selectable: false,
              children: [
                {
                  ...item,
                  treeType: 'inst',
                  isLeaf: true
                }
              ]
            })
            instObj[item.type] = true
          }
        }
      })
      this.instTreeData = instList
    }
  }
}
</script>

<style lang="less" scoped>
.inst-wrap {
  min-height: 400px;
}
.select-all {
  margin-left: 10px;
  margin-bottom: 10px;
}
</style>
