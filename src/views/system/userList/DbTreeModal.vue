<template>
  <div>
    <a-modal
      title="库表授权"
      :visible="visible"
      v-if="visible"
      @ok="handleOk"
      @cancel="handleCancel"
      :confirm-loading="confirmLoading"
      width="85%"
    >
      <div class="flex">
        <ul class="flex-one db-list">
          <div class="table-header">实例类型</div>
          <li
            v-for="item in instanceType.$items"
            :key="item.value"
            @click="handleInstanceType(item.value)"
            :class="{ active: item.value === currentInsType }"
          >
            {{ item.label }}
            <a-icon type="right" />
          </li>
        </ul>
        <div class="line"></div>
        <ul class="flex-one db-list">
          <div class="table-header">实例</div>
          <template v-if="instanceList.length > 0">
            <li
              v-for="item in instanceList"
              :key="item.id"
              @click="handleInstance(item.type, item.id)"
              :class="{ active: item.id === currentIns }"
            >
              {{ item.name }}
              <a-icon type="right" />
            </li>
          </template>
          <a-empty v-else />
        </ul>
        <div class="line"></div>
        <div class="table-wrap flex-one">
          <div class="table-header">库表</div>
          <template v-if="currentInsType === '2'">
            <template v-if="currentRedisList.length > 0">
              <a-checkbox
                v-for="item in currentRedisList"
                :key="item.id"
                :checked="currentRedisChecked"
                @change="handleRedis"
                style="margin-left: 20px"
              >
                {{ item.name }}
              </a-checkbox>
            </template>
            <a-empty v-else />
          </template>
          <template v-else>
            <template v-if="treeData.length > 0 && currentInsType !== 2">
              <a-button class="select-all" type="primary" @click="handleSelectAll">全选 </a-button>
              <!-- <a-tree checkable :tree-data="treeData" v-model="checkedKeys" @check="onCheck" /> -->
              <virtual-list
                class="dbtb-tree-content"
                :data-key="'key'"
                :data-sources="visibleList"
                :data-component="itemComponent"
                :extraProps="{ expandedMap, indeterminate, selectedMap, collapse, check }"
              />
            </template>
            <a-empty v-else />
          </template>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import SplitWindow from '@/components/split-resize'
import {
  associatedSchema,
  getAuthByUserId,
  getDatabase,
  getDatabaseBySql,
  getDatabaseByPgsql,
  getDatabaseByMongo,
  getUserAuthInstance
} from '@/api/userList'
import { DMS_INSTANCE_TYPE } from '@/utils/const'
import itemComponent from './item'
import VirtualList from 'vue-virtual-scroll-list'

export default {
  components: {
    VirtualList,
    SplitWindow
  },
  data() {
    return {
      itemComponent,
      visible: false,
      confirmLoading: false,
      userId: null,
      treeData: [],
      oriSchemas: [],
      checkedKeys: [],
      instanceType: DMS_INSTANCE_TYPE,
      instanceList: [],
      currentInsType: '', //  选中实例类型
      currentIns: '', //  选中实例
      expandedMap: {},
      selectedMap: {},
      indeterminate: {},
      selectedDBCount: {},
      selectAllStatus: false,
      currentRedisList: [],
      redisSchemaKeys: [],
      userAuthRedis: [], //  用户授权的redis
      currentRedisChecked: false
    }
  },
  methods: {
    handleOpenModal(record) {
      this.visible = true
      this.userId = record.id
      this.checkedKeys = []
      this.instanceList = []
      this.currentRedisList = []
      this.treeData = []
      this.selectedMap = {}
      this.currentInsType = ''
      this.currentIns = ''
    },
    handleOk() {
      if (!this.currentInsType) {
        this.$message.warning('请先选择实例类型')
        return
      }
      if (!this.currentIns) {
        this.$message.warning('请先选择实例')
        return
      }
      let schemaKeys
      if (this.currentInsType === '2') {
        schemaKeys = this.redisSchemaKeys
      } else {
        const list = Object.values(this.selectedMap).filter(
          v => typeof v === 'object' && v !== null
        )
        schemaKeys = list.map(o => o.key)
      }
      this.confirmLoading = true
      associatedSchema({
        user_id: this.userId,
        inst_type: this.currentInsType,
        inst_id: this.currentIns,
        schema_keys: schemaKeys
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
    dealTreeData(schemas) {
      return schemas.reduce((list, res) => {
        const { db, tables } = res

        const children = (tables || []).map(tb => ({
          ...tb,
          db_name: db.name,
          parent: db
        }))

        db.children = children
        list.push(db, ...children)

        return list
      }, [])
    },
    onCheck(checkedKeys, e) {
      this.checkedKeys = checkedKeys
    },
    handleSelectAll() {
      this.selectAllStatus = !this.selectAllStatus
      if (!this.selectAllStatus) {
        this.selectedMap = {}
        this.indeterminate = {}
        return
      }
      const selectedMap = {}
      this.treeData.map(item => {
        selectedMap[item.key] = item.children && item.children.length > 0 ? true : item
      })

      this.indeterminate = {}
      this.selectedMap = selectedMap
    },
    handleInstanceType(type) {
      this.currentInsType = type
      this.instanceList = []
      this.treeData = []
      this.selectedMap = {}
      this.currentRedisList = []
      getDatabase({ type }).then(res => {
        this.instanceList = res
      })
      //  redis的直接获取用户的授权
      if (type === DMS_INSTANCE_TYPE.Redis) {
        getUserAuthInstance({ type, user_id: this.userId }).then(res => {
          this.userAuthRedis = res
        })
      }
    },
    async handleInstance(type, id) {
      this.currentIns = id
      this.treeData = []
      this.checkedKeys = []
      this.selectedMap = {}
      this.indeterminate = {}
      let ret
      switch (type) {
        case '1':
          ret = await getDatabaseBySql({ inst_id: id })
          break
        case '2':
          this.currentRedisChecked = this.userAuthRedis.some(item => item.id === id)
          console.log(this.currentRedisChecked)
          break
        case '3':
          ret = await getDatabaseByMongo({ inst_id: id })
          break
        case '4':
          ret = await getDatabaseByPgsql({ inst_id: id })
          break
        default:
          break
      }

      if (type !== '2') {
        const userAuthRet = await getAuthByUserId({
          inst_id: id,
          user_id: this.userId
        })
        this.oriSchemas = ret.schemas
        this.treeData = this.dealTreeData(ret.schemas)
        this.dealInitTreeData(ret.schemas, userAuthRet.schemas)
      } else {
        this.currentRedisList = this.instanceList.filter(
          item => item.type === type && item.id === id
        )
      }
    },
    //  初始化树数据
    dealInitTreeData(oriDbData, userDbData) {
      if (userDbData && userDbData.length > 0) {
        let selectedMap = {}
        userDbData.map(item => {
          const oriTableLen = this.getOriDaLenth(oriDbData, item.db.key)
          if (item.tables.length > 0) {
            this.$set(this.indeterminate, item.db.key, item.tables.length < oriTableLen)
            selectedMap = { ...selectedMap, ...{ [item.db.key]: true } }
          }
          item.tables.map(tbItem => {
            selectedMap = { ...selectedMap, ...{ [tbItem.key]: tbItem } }
          })
        })
        this.selectedMap = selectedMap
      } else {
        this.selectedMap = {}
      }
    },
    getOriDaLenth(oriDbData, dbKey) {
      return oriDbData.filter(item => item.db.key === dbKey)[0].tables.length
    },
    collapse(d) {
      this.$set(this.expandedMap, d.key, !this.expandedMap[d.key])
    },
    check(e, d) {
      const currStatus = !this.selectedMap[d.key]
      if (d.children) {
        this.$set(this.selectedMap, d.key, d.children.length > 0 ? currStatus : d)
        for (const child of d.children) {
          this.$set(this.selectedMap, child.key, currStatus ? child : null)
        }
        this.$set(this.selectedDBCount, d.key, currStatus ? d.children.length : 0)
        this.$set(this.indeterminate, d.key, false)
      } else {
        this.$set(this.selectedMap, d.key, currStatus ? d : null)
      }

      if (d.parent) {
        const pKey = d.parent.key
        const count = this.selectedDBCount[pKey] || 0
        const currCount = count + (currStatus ? 1 : -1)
        this.$set(this.selectedDBCount, d.parent.key, currCount)

        this.$set(this.selectedMap, pKey, currCount === d.parent.children.length)
        this.$set(this.indeterminate, pKey, currCount > 0 && currCount < d.parent.children.length)
      }
    },
    handleRedis(e) {
      this.currentRedisChecked = e.target.checked
      if (e.target.checked) {
        this.redisSchemaKeys = [this.currentIns]
      } else {
        this.redisSchemaKeys = []
      }
    }
  },
  computed: {
    visibleList() {
      return this.treeData.filter(d => !!d.children || (d.parent && this.expandedMap[d.parent.key]))
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
.flex {
  display: flex;
  height: 500px;
}
.flex-one {
  flex: 1;
  height: 500px;
  overflow: auto;
}
.db-list {
  list-style: none;
  padding-left: 20px;
  padding-right: 20px;

  > li {
    line-height: 30px;
    cursor: pointer;
    padding: 0 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &:hover {
      background: #e6f7ff;
    }

    &.active {
      background: #bae7ff;
    }
  }
}
.line {
  height: 100%;
  width: 2px;
  background: #ccc;
}
.table-header {
  background: #fafafa;
  border-bottom: 1px solid #e8e8e8;
  height: 45px;
  line-height: 45px;
  padding-left: 12px;
  margin-bottom: 12px;
}
.dbtb-tree-content {
  height: 400px;
  overflow: auto;
}
</style>
