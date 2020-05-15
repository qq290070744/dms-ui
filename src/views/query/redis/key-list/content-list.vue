<template>
  <div class="redis-key-list">
    <div class="function-row">
      <a-button type="primary" size="small">新增</a-button>
      <work-order-action
        :disabled="!selectedRowKeys.length"
        :extraParams="extraParams"
        :genActionObject="genActionObject"
        @success="onSuccess"
        title="删除"
      />
    </div>
    <a-table
      v-bind="finalTableOption"
      :customRow="customRow"
      @change="onChange"
      bordered
      size="small"
    >
      <span slot="serial" slot-scope="text, record, index">
        {{ index + 1 }}
      </span>
    </a-table>
  </div>
</template>

<script>
import { waitRefShow, calcTableBodyHeight } from '@/utils/util'
import WorkOrderAction from '../work-order-action'
export default {
  components: {
    WorkOrderAction
  },
  props: {
    tableOptions: {
      type: Object,
      default () { return {} }
    }
  },
  data () {
    return {
      extraParams: {},
      activedRow: {},
      selectedRowKeys: [],
      table: {
        ref: 'redisTable',
        scroll: { y: 'auto' },
        pagination: {
          defaultPageSize: 50,
        },
        columns: [
          {
            title: '#',
            width: 40,
            scopedSlots: { customRender: 'serial' }
          },
          {
            title: '类型',
            dataIndex: 'type',
            width: 60
          },
          {
            title: '键名',
            dataIndex: 'key'
          }
        ],
        rowSelection: {
          onChange: (selectedRowKeys, _selectedRows) => {
            this.selectedRowKeys = selectedRowKeys
          },
        }
      }
    }
  },
  computed: {
    finalTableOption () {
      return {
        ...this.tableOptions,
        ...this.table
      }
    }
  },
  watch: {
    'tableOptions.dataSource' () {
      this.initTableHeight()
    }
  },
  methods: {
    customRow (record) {
      return {
        class: this.activedRow === record ? 'redis-key-list--row-select' : '',
        nativeOn: { click: () => this.onKeyClick(record) }
      }
    },
    onKeyClick (record) {
      this.activedRow = record
      this.$emit('row-change', record)
    },
    initTableHeight () {
      if (this.table.scroll.y !== 'auto') {
        return
      }
      waitRefShow(this, 'redisTable')
        .then((ref) => {
          this.table.scroll.y = calcTableBodyHeight(ref.$el)
        })
    },
    onChange (pagination /** , filters, sorter */) {
      this.$emit('page-change', pagination.current, pagination.pageSize)
    },
    onSuccess () {
      this.selectedRowKeys = []
    },
    genActionObject () {
      const commands = this.selectedRowKeys.map((key) => {
        return 'DEL ' + key
      })
      return { commands, actions: [] }
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
.redis-key-list, .redis-value-box--content {
  .ant-table colgroup > col.ant-table-selection-col {
    width: 40px;
  }
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
      background-color: #a0d1ff ;
    }
  }
  // 分页
  .ant-pagination.mini.ant-table-pagination {
    margin: 4px 0;
  }
}
</style>
