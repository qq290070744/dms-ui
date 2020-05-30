<template>
  <div class="container">
    <div class="search">
      <a-form layout="inline">
        <a-form-item label="菜单名称">
          <a-input placeholder="请输入菜单名称" allow-clear> </a-input>
        </a-form-item>
        <a-form-item label="菜单状态">
          <a-input placeholder="菜单状态"> </a-input>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="handleSearch">搜索</a-button>
          <a-button type="primary" @click="handleCreate">新增</a-button>
        </a-form-item>
      </a-form>
    </div>
    <div class="table">
      <a-table :columns="columns" :data-source="menuList" rowKey="id" :loading="loading">
        <template slot="operation" slot-scope="text, record">
          <a-button type="primary" @click="handleAdd(record)" size="small">
            新增
          </a-button>
          <a-button type="primary" @click="handleEdit(record)" size="small">
            编辑
          </a-button>
          <a-button type="danger" @click="handleDelete(record)" size="small">
            删除
          </a-button>
          <a-button type="primary" @click="handleAssociated(record)" size="small">
            关联
          </a-button>
        </template>
        <template slot="status" slot-scope="record">
          <span>{{ record | filterStatus }}</span>
        </template>
        <template slot="extras" slot-scope="record">
          <a-icon :type="record.extras" />
        </template>
      </a-table>
    </div>
    <CreateModal ref="createModal" @modalSuccess="modalSuccess"></CreateModal>
    <ApiTransfer ref="apiTransfer" @transferSuccess="transferSuccess" />
  </div>
</template>

<script>
import CreateModal from './CreateModal'
import ApiTransfer from './ApiTransfer'
import { getMenuTree, deleteMenu } from '@/api/menu'

const columns = [
  {
    title: '菜单名称',
    key: 'display_name',
    dataIndex: 'display_name'
  },
  {
    title: '图标',
    key: 'icon',
    scopedSlots: { customRender: 'extras' }
  },
  {
    title: '排序',
    key: 'paixu',
    dataIndex: 'paixu'
  },
  {
    title: '权限标识',
    key: 'name',
    dataIndex: 'name'
  },
  {
    title: '路径',
    key: 'path',
    dataIndex: 'path'
  },
  {
    title: '可见',
    key: 'status',
    scopedSlots: { customRender: 'status' },
    align: 'center'
  },
  {
    title: '创建时间',
    key: 'time',
    dataIndex: 'time'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' }
  }
]

const statusMap = {
  0: '隐藏',
  1: '显示'
}

export default {
  data() {
    return {
      columns,
      menuList: [],
      loading: false
    }
  },
  components: {
    CreateModal,
    ApiTransfer
  },
  methods: {
    handleCreate() {
      this.$refs.createModal.handleCreate()
    },
    handleSearch() {},
    handleAdd(record) {
      this.$refs.createModal.handleAdd(record)
    },
    handleEdit(record) {
      this.$refs.createModal.handleEdit(record)
    },
    handleDelete(record) {
      const _this = this
      this.$confirm({
        title: '是否确认删除？',
        onOk() {
          deleteMenu(record.id).then(() => {
            _this.$message.success('删除成功！')
            _this.fetchMenuTree()
            _this.$store.dispatch('GenerateRoutes')
          })
        }
      })
    },
    handleAssociated(record) {
      this.$refs.apiTransfer.open(record)
    },
    fetchMenuTree() {
      this.loading = true
      getMenuTree().then(res => {
        this.menuList = res.children
        this.loading = false
      })
    },
    modalSuccess() {
      this.fetchMenuTree()
      this.$store.dispatch('GenerateRoutes')
    },
    transferSuccess() {
      this.fetchMenuTree()
    }
  },
  created() {
    this.fetchMenuTree()
  },
  filters: {
    filterStatus(data) {
      if (data.type === 1) {
        return statusMap[data.status]
      }
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  background: #fff;
  padding: 20px;
  button {
    margin-right: 10px;
    &:last-child {
      margin-right: 0;
    }
  }
}

.table {
  margin-top: 25px;
}
</style>
