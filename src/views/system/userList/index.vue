<template>
  <div class="container">
    <div class="table">
      <a-table :columns="columns" :data-source="userList" rowKey="id">
        <template slot="operation" slot-scope="text, record">
          <a-button type="primary" @click="handleAssociated(record)" size="small">
            关联角色
          </a-button>
          <a-button type="primary" @click="handleTransfer(record)" size="small">
            实例授权
          </a-button>
        </template>
      </a-table>
    </div>
    <AssociatedRole ref="associatedModal" />
    <TransferModal ref="transferModal" />
  </div>
</template>

<script>
import { getUserList } from '@/api/userList'
import moment from 'moment'
import AssociatedRole from './AssociatedRole'
import TransferModal from './TransferModal'

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
      current: 1,
      pageSize: 20,
      columns
    }
  },
  components: {
    AssociatedRole,
    TransferModal
  },
  methods: {
    initData() {
      getUserList({
        page: this.current,
        page_size: this.pageSize
      }).then(res => {
        this.userList = res.Records
      })
    },
    handleAssociated(record) {
      this.$refs.associatedModal.handleOpenModal(record)
    },
    handleTransfer(record) {
      this.$refs.transferModal.handleOpenModal(record)
    }
  },
  created() {
    this.initData()
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
