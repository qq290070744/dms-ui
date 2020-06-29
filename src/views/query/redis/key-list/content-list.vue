<template>
  <div class="redis-key-list">
    <div class="function-row">
      <a-button :disabled="creating" type="primary" size="small" @click="create">
        <span>{{ creating ? '创建中' : '新增' }}</span>
      </a-button>
      <work-order-action
        :disabled="!selectedRowKeys.length"
        :extraParams="extraParams"
        :genActionObject="genActionObject"
        @success="onSuccess"
        title="删除"
      />
      <work-order-action
        :extraParams="extraParams"
        title="创建命令行工单"
      />
      <a-button type="primary" size="small" @click="triggerSearch" :loading="searchLoading">搜索</a-button>
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
import EventBus, { REDIS_KEY_CREATED } from '../event-bus'
export default {
  components: {
    WorkOrderAction
  },
  props: {
    tableOptions: {
      type: Object,
      default () { return {} }
    },
    extraParams: {
      type: Object,
      default () { return {} }
    },
    search: {
      type: Function,
      default: null
    }
  },
  data () {
    return {
      searchLoading: false,
      creating: false,
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
  mounted () {
    EventBus.$on(REDIS_KEY_CREATED, this.closeCreate)
  },
  beforeDestroy () {
    EventBus.$off(REDIS_KEY_CREATED, this.closeCreate)
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
      if (this.creating) {
        this.$confirm({
          title: '当前正在创建 Redis key，是否放弃当前的修改？',
          onOk: () => {
            this.creating = false
            this.activedRow = record
            this.$emit('row-change', record)
          }
        })
        return
      }
      this.creating = false
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
    },
    create () {
      this.creating = true
      this.$emit('create')
    },
    closeCreate () {
      this.creating = false
      this.$emit('row-change', null)
    },
    triggerSearch () {
      this.searchLoading = true
      this.search().then(() => {
        this.searchLoading = false
      }, () => {
        this.searchLoading = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
// src\components\global.less
.redis-key-list {
  flex: 1;
}
.function-row {
  margin: 8px 0;
  .ant-btn+.work-order-action,
  .work-order-action+.ant-btn
  {
    margin-left: 8px;
  }
}
</style>
