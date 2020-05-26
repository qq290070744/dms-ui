<template>
  <div class="container">
    <div class="search">
      <a-form layout="inline">
        <a-form-item label="角色名称">
          <a-input placeholder="请输入角色名称" allow-clear> </a-input>
        </a-form-item>
        <a-form-item label="角色状态">
          <a-input placeholder="角色状态"> </a-input>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="handleSearch">搜索</a-button>
          <a-button type="primary" @click="handleCreate">新增</a-button>
        </a-form-item>
      </a-form>
    </div>
    <div class="table">
      <a-table :columns="columns" :data-source="roleList" rowKey="id">
        <template slot="operation" slot-scope="text, record">
          <a-button type="primary" @click="handleEdit(record)" size="small">
            编辑
          </a-button>
          <a-button type="danger" @click="handleDelete(record)" size="small">
            删除
          </a-button>
        </template>
      </a-table>
    </div>
    <CreateModal ref="createModal" @modalSuccess="modalSuccess"></CreateModal>
  </div>
</template>

<script>
import CreateModal from './CreateModal'
import { getRoles, deleteRole } from '@/api/role'

const columns = [
  {
    title: '角色编号',
    key: 'id',
    dataIndex: 'id'
  },
  {
    title: '角色名称',
    key: 'display_name',
    dataIndex: 'display_name'
  },
  {
    title: '权限字符',
    key: 'name',
    dataIndex: 'name'
  },
  {
    title: '显示顺序',
    key: 'jsbh',
    dataIndex: 'jsbh'
  },
  {
    title: '状态',
    key: 'status',
    dataIndex: 'status'
  },
  {
    title: '创建时间',
    key: 'created_time',
    dataIndex: 'created_time'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' }
  }
]

export default {
  data() {
    return {
      columns,
      roleList: []
    }
  },
  components: {
    CreateModal
  },
  methods: {
    fetchRoles() {
      getRoles().then(res => {
        this.roleList = res.records || []
      })
    },
    handleCreate() {
      this.$refs.createModal.handleCreate()
    },
    handleSearch() {},
    handleEdit(record) {
      this.$refs.createModal.handleEdit(record)
    },
    handleDelete(record) {
      const _this = this
      this.$confirm({
        title: '是否确认删除？',
        onOk() {
          deleteRole(record.id).then(() => {
            _this.$message.success('删除成功！')
            _this.fetchRoles()
          })
        }
      })
    },
    modalSuccess() {
      this.fetchRoles()
    }
  },
  created() {
    this.fetchRoles()
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
