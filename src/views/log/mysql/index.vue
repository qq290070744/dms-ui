<template>
  <div class="container">
    <div class="search">
      <a-form-model layout="inline" :model="searchForm">
        <a-form-model-item label="用户名称">
          <a-input placeholder="请输入用户名称" allow-clear v-model="searchForm.username">
          </a-input>
        </a-form-model-item>
        <a-form-model-item label="实例ID">
          <a-input placeholder="请输入实例ID" allow-clear v-model="searchForm.inst_id"> </a-input>
        </a-form-model-item>
        <a-form-model-item>
          <a-button type="primary" @click="handleSearch">搜索</a-button>
        </a-form-model-item>
      </a-form-model>
    </div>
    <div class="table">
      <a-table
        :columns="columns"
        :data-source="tableDataSource"
        :rowKey="genRowKey"
        :pagination="pagination"
        @change="handleTableChange"
        :loading="tableLoading"
      >
      </a-table>
    </div>
  </div>
</template>

<script>
import { getMysqlLog } from '@/api/userList'
import moment from 'moment'

const columns = [
  {
    title: '用户',
    key: 'username',
    dataIndex: 'username'
  },
  {
    title: '实例id',
    key: 'inst_id',
    dataIndex: 'inst_id'
  },
  {
    title: '实例名',
    key: 'inst_name',
    dataIndex: 'inst_name'
  },
  {
    title: '数据库名',
    key: 'db_name',
    dataIndex: 'db_name'
  },
  {
    title: '表名',
    key: 'tb_name',
    dataIndex: 'tb_name'
  },
  {
    title: '查询语句',
    key: 'sql',
    dataIndex: 'sql',
    width: '250px'
  },
  {
    title: '记录时间',
    key: 'created_time',
    dataIndex: 'created_time',
    customRender: text => moment(text).format('YYYY-MM-DD HH:mm:ss')
  }
]

export default {
  data() {
    return {
      columns,
      tableDataSource: [],
      tableLoading: false,
      pagination: {
        current: 1,
        pageSize: 10
      },
      searchForm: {
        username: '',
        inst_id: ''
      }
    }
  },
  methods: {
    fetchData() {
      this.tableLoading = true
      getMysqlLog({
        page: this.pagination.current,
        page_size: this.pagination.pageSize,
        ...this.searchForm
      }).then(res => {
        const pagination = { ...this.pagination }
        pagination.total = res.total
        this.tableDataSource = res.Records
        this.pagination = pagination
        this.tableLoading = false
      })
    },
    handleTableChange(pagination) {
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.fetchData()
    },
    handleSearch() {
      this.pagination.current = 1
      this.fetchData()
    },
    genRowKey(e) {
      return `${Math.random()}key`
    }
  },
  created() {
    this.fetchData()
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
