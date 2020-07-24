<template>
  <basic-container>
    <x-form
      v-if="filters.length"
      layout="inline"
      :fields="filters"
      @filter="doFilter"
    />
    <s-table
      ref="table"
      rowKey="id"
      size="default"
      :columns="finalColumns"
      :data="loadData"
    />
  </basic-container>
</template>

<script>
import '../components/install'
import STable from '@/components/Table'
import { DMS_INSTANCE_TYPE, DMS_PERMS_ORDER_TYPE } from '@/utils/const'

const defaultFilter = () => {
  return [
    // ['type', '类型', {
    //   component: 'a-select',
    //   props: {
    //     options: DMS_INSTANCE_TYPE.$items
    //   }
    // }],
    ['auditor', '审核人', {
      component: 'user-complete'
    }],
    ['applicant', '申请人', {
      component: 'user-complete'
    }]
  ]
}

export default {
  components: {
    STable
  },
  props: {
    page: {
      type: Function,
      default: () => () => Promise.reject(new Error('请传入参数'))
    },
    operation: {
      type: Object,
      default: null
    },
    filters: {
      type: Array,
      default: defaultFilter
    }
  },
  data () {
    const columns = [
      {
        title: '#',
        width: 60,
        customRender: (_text, _record, index) => {
          return index + 1
        }
      },
      {
        title: '主机',
        dataIndex: 'host',
        width: 200,
        customRender: (v, record) => {
          return <span>{v}({record.name})</span>
        }
      },
      {
        title: '实例类型',
        dataIndex: 'type',
        width: 100,
        customRender: (v) => {
          return DMS_INSTANCE_TYPE.$label[v]
        }
      },
      {
        title: '申请原因',
        dataIndex: 'reason',
        width: 250,
      },
      {
        title: 'SQL语句',
        dataIndex: 'command',
        width: 300,
        customRender: (text) => <XTableCellEllipsis text={text}/>
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: 80,
        customRender: (v) => {
          const { label, color } = DMS_PERMS_ORDER_TYPE.$map[v] || {}
          return <a-tag color={color}>{label}</a-tag>
        }
      },
      {
        title: <a-tooltip placement="right">
          <span slot="title">两小时内有效</span>
          下载链接
          <a-icon type="info-circle" style={{ marginLeft: '6px', color: '#ff6666' }}/>
        </a-tooltip>,
        dataIndex: 'download_url',
        width: 120,
        customRender: (v) => {
          return v ? <a href={v}>下载</a> : '无'
        }
      },
      {
        title: '申请人',
        dataIndex: 'applicant',
        width: 100
      },
      {
        title: '审核人',
        dataIndex: 'auditor',
        width: 100
      },
      {
        title: '创建时间',
        dataIndex: 'created_time',
        width: 180,
        customRender: (v) => {
          return v.replace('T', ' ').slice(0, 19)
        }
      }
    ]
    return {
      columns,
      queryParam: {},
      loadData: parameter => {
        parameter = {
          ...parameter,
          ...this.queryParam
        }
        return this.page(parameter)
      },
    }
  },
  computed: {
    finalColumns () {
      return this.operation
        ? [...this.columns, this.operation]
        : this.columns
    }
  },
  methods: {
    doFilter (data) {
      this.queryParam = data
      this.refresh(true)
    },
    refresh (force = false) {
      this.$refs.table.refresh(force)
    }
  }
}
</script>

<style>

</style>
