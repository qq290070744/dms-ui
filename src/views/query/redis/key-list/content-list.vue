<template>
  <div class="redis-key-list">
    <div class="function-row">
      <a-button type="primary" size="small">新增</a-button>
      <a-button size="small">删除1</a-button>
    </div>
    <s-table
      ref="redisTable"
      rowKey="key"
      :data="loadData"
      :columns="columns"
      :customRow="customRow"
      :scroll="{y: tableHeight}"
      :pageSize="40"
      bordered
      size="small"
    >
      <span slot="serial" slot-scope="text, record, index">
        {{ index + 1 }}
      </span>
    </s-table>
  </div>
</template>

<script>
import { STable } from '@/components'
import * as redisApi from '@/api/redis'
import { waitRefShow } from '@/utils/util'
export default {
  components: {
    STable
  },
  data () {
    return {
      selectRow: {},
      columns: [
        {
          title: '#',
          width: 40,
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '类型',
          dataIndex: 'type',
          width: 80
        },
        {
          title: '键名',
          dataIndex: 'key'
        }
      ],
      tableHeight: 400,
      // 查询条件参数
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return redisApi.page({ ...parameter, ...this.queryParam })
          .then(result => result)
      }
    }
  },
  mounted () {
    this.initTableHeight()
  },
  methods: {
    customRow (record) {
      return {
        class: record.key === this.selectRow.key ? 'redis-key-list--row-select' : '',
        nativeOn: { click: () => this.onKeyClick(record) }
      }
    },
    onKeyClick (record) {
      this.selectRow = record
      redisApi.key(record)
    },
    initTableHeight () {
      waitRefShow(this, 'redisTable')
        .then((ref) => {
          const { top } = ref.$el.getBoundingClientRect()
          this.tableHeight = document.body.clientHeight - top - 24 - 40
        })
    }
  }
}
</script>

<style lang="less" scoped>
.redis-key-list {
  flex: 1;
}
.function-row {
  margin: 8px 8px 8px;
  .ant-btn {
    margin-right: 8px;
  }
}
</style>

<style lang="less">
.redis-key-list {
  .ant-table-small > .ant-table-content > .ant-table-header > table > .ant-table-thead > tr > th, .ant-table-small > .ant-table-content > .ant-table-body > table > .ant-table-thead > tr > th, .ant-table-small > .ant-table-content > .ant-table-scroll > .ant-table-header > table > .ant-table-thead > tr > th, .ant-table-small > .ant-table-content > .ant-table-scroll > .ant-table-body > table > .ant-table-thead > tr > th, .ant-table-small > .ant-table-content > .ant-table-fixed-left > .ant-table-header > table > .ant-table-thead > tr > th, .ant-table-small > .ant-table-content > .ant-table-fixed-right > .ant-table-header > table > .ant-table-thead > tr > th, .ant-table-small > .ant-table-content > .ant-table-fixed-left > .ant-table-body-outer > .ant-table-body-inner > table > .ant-table-thead > tr > th, .ant-table-small > .ant-table-content > .ant-table-fixed-right > .ant-table-body-outer > .ant-table-body-inner > table > .ant-table-thead > tr > th, .ant-table-small > .ant-table-content > .ant-table-header > table > .ant-table-tbody > tr > td, .ant-table-small > .ant-table-content > .ant-table-body > table > .ant-table-tbody > tr > td, .ant-table-small > .ant-table-content > .ant-table-scroll > .ant-table-header > table > .ant-table-tbody > tr > td, .ant-table-small > .ant-table-content > .ant-table-scroll > .ant-table-body > table > .ant-table-tbody > tr > td, .ant-table-small > .ant-table-content > .ant-table-fixed-left > .ant-table-header > table > .ant-table-tbody > tr > td, .ant-table-small > .ant-table-content > .ant-table-fixed-right > .ant-table-header > table > .ant-table-tbody > tr > td, .ant-table-small > .ant-table-content > .ant-table-fixed-left > .ant-table-body-outer > .ant-table-body-inner > table > .ant-table-tbody > tr > td, .ant-table-small > .ant-table-content > .ant-table-fixed-right > .ant-table-body-outer > .ant-table-body-inner > table > .ant-table-tbody > tr > td {
    padding: 0 4px;
  }
  .ant-table-tbody > tr {
    td {
      white-space: nowrap;
    }
    &:nth-child(2n) > td {
      background-color: #ebf9ff ;
    }
  }
  // 选中时 .redis-key-list--row-select
  .ant-table-tbody > tr.ant-table-row.redis-key-list--row-select {
    & > td, &:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected) > td {
      background-color: #5bcbff ;
    }
  }
  // 分页
  .ant-pagination.mini.ant-table-pagination {
    margin: 4px 0;
  }
}
</style>
