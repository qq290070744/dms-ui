<template>
  <div class="container">
    <div class="search">
      <a-form-model layout="inline" :model="searchForm">
        <a-form-model-item label="工单类型">
          <a-select v-model="searchForm.type" :options="orderTypeOptions" placeholder="请选择工单类型"/>
        </a-form-model-item>
        <a-form-model-item label="用户名称">
          <a-input placeholder="请输入用户名称" allow-clear v-model="searchForm.username">
          </a-input>
        </a-form-model-item>
        <a-form-model-item label="审核人">
          <a-input placeholder="请输入审核人" allow-clear v-model="searchForm.assigned "> </a-input>
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
import { getFinished as getLog } from '@/api/work-order'
import { DMS_ORDER_TYPE, DMS_MODIFY_ORDER_STATUS } from '@/utils/const'

export default {
  data() {
    const columns = [
      {
        title: '#',
        width: 60,
        customRender: (_text, _record, index) => {
          return <span>{ index + 1 }</span>
        }
      },
      {
        title: '类型',
        dataIndex: 'type',
        customRender: (text) => {
          return DMS_ORDER_TYPE.$label[text]
        }
      },
      {
        title: '数据库名',
        dataIndex: 'data_base',
      },
      {
        title: '数据库机器源',
        dataIndex: 'inst_name',
      },
      {
        title: '状态',
        dataIndex: 'status',
        customRender: (status, record, index) => {
          const item = DMS_MODIFY_ORDER_STATUS.$map[status]
          return <a-tag color={item.color}>{ item.label }</a-tag>
        }
      },
      {
        title: '备注',
        dataIndex: 'text',
        width: 300,
      },
      {
        title: '审核人',
        dataIndex: 'assigned',
      },
      {
        title: '创建人',
        dataIndex: 'username',
      },
      {
        title: '创建时间',
        dataIndex: 'created_time',
      }
    ]
    return {
      columns,
      tableDataSource: [],
      tableLoading: false,
      pagination: {
        current: 1,
        pageSize: 10
      },
      searchForm: {
        type: undefined,
        username: '',
        assigned: ''
      },
      orderTypeOptions: DMS_ORDER_TYPE.$items
    }
  },
  methods: {
    fetchData() {
      this.tableLoading = true
      getLog({
        page: this.pagination.current,
        page_size: this.pagination.pageSize,
        ...this.searchForm
      }).then(res => {
        const pagination = { ...this.pagination }
        pagination.total = res.total
        this.tableDataSource = res.records
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
