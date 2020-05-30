<template>
  <div class="container">
    <div class="search">
      <a-form-model layout="inline" :model="myForm">
        <a-form-model-item label="用户名称">
          <a-input placeholder="请输入用户名称" allow-clear v-model="myForm.name"> </a-input>
        </a-form-model-item>
        <a-form-model-item>
          <a-button type="primary" @click="handleSearch">搜索</a-button>
        </a-form-model-item>
      </a-form-model>
    </div>
    <div class="table">
      <a-table
        :columns="columns"
        :data-source="userList"
        :loading="loading"
        rowKey="id"
        :pagination="pagination"
        @change="handleTableChange"
      >
        <template slot="operation" slot-scope="text, record">
          <a-button type="primary" @click="handleAssociated(record)" size="small">
            关联角色
          </a-button>
          <a-button type="primary" @click="handleTransfer(record)" size="small">
            实例授权
          </a-button>
          <a-button type="primary" @click="handleDatabase(record)" size="small">
            库表授权
          </a-button>
        </template>
      </a-table>
    </div>
    <AssociatedRole ref="associatedModal" />
    <TransferModal ref="transferModal" :databaseSource="databaseSource" />
    <DbTreeModal ref="dbTreeModal" :databaseSource="databaseSource" />
  </div>
</template>

<script>
import { getUserList, getDatabase } from '@/api/userList'
import moment from 'moment'
import AssociatedRole from './AssociatedRole'
import TransferModal from './TransferModal'
import DbTreeModal from './DbTreeModal'

const columns = [
  {
    title: '用户',
    key: 'name',
    dataIndex: 'name'
  },
  {
    title: '手机',
    key: 'mobile',
    dataIndex: 'mobile'
  },
  {
    title: '邮箱',
    key: 'email',
    dataIndex: 'email'
  },
  {
    title: '部门',
    key: 'org_name',
    dataIndex: 'org_name'
  },
  {
    title: '更新时间',
    key: 'updated_time',
    dataIndex: 'updated_time',
    customRender: text => moment(text).format('YYYY-MM-DD HH:mm:ss')
  },
  {
    title: '状态',
    key: 'status',
    dataIndex: 'status',
    customRender: text => (text === 1 ? '启用' : '停用')
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
      userList: [],
      columns,
      pagination: {
        current: 1,
        pageSize: 10
      },
      loading: false,
      databaseSource: [],
      myForm: {}
    }
  },
  components: {
    AssociatedRole,
    TransferModal,
    DbTreeModal
  },
  methods: {
    fetchData() {
      this.loading = true
      getUserList({
        page: this.pagination.current,
        page_size: this.pagination.pageSize,
        condition: 'name',
        q: this.myForm.name
      }).then(res => {
        const pagination = { ...this.pagination }
        pagination.total = res.total
        this.userList = res.Records
        this.pagination = pagination
        this.loading = false
      })
    },
    handleAssociated(record) {
      this.$refs.associatedModal.handleOpenModal(record)
    },
    handleTransfer(record) {
      this.$refs.transferModal.handleOpenModal(record)
    },
    handleTableChange(pagination) {
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.fetchData()
    },
    handleDatabase(record) {
      this.$refs.dbTreeModal.handleOpenModal(record)
    },
    fetchDatabase() {
      getDatabase().then(res => {
        const list = (res || []).map(item => {
          return {
            ...item,
            key: item.id.toString(),
            title: item.name
          }
        })
        this.databaseSource = list
      })
    },
    handleSearch() {
      this.pagination.current = 1
      this.fetchData()
    }
  },
  created() {
    this.fetchData()
    this.fetchDatabase()
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
