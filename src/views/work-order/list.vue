<script>
export default {
  props: {
    dataSource: {
      type: [Array, Function],
      default () {
        return []
      }
    }
  },
  data () {
    const columns = [
      {
        title: '#',
        width: 60,
        scopedSlots: { customRender: 'serial' }
      },
      {
        title: '类型',
        dataIndex: 'type',
      },
      {
        title: '数据库',
        dataIndex: 'data_base',
      },
      {
        title: '数据库机器',
        dataIndex: 'source',
      },
      {
        title: '状态',
        dataIndex: 'status',
      },
      {
        title: '备注',
        dataIndex: 'text',
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
      },
      {
        title: '操作',
        width: 200,
        scopedSlots: { customRender: 'handler' }
      }
    ]
    return {
      innerSource: null,
      pagination: {},
      columns,
    }
  },
  computed: {
    finalDataSource () {
      return Array.isArray(this.dataSource) ? this.dataSource : this.innerSource
    }
  },
  created () {
    this.getSource()
  },
  methods: {
    getSource (parameters = {}) {
      if (typeof this.dataSource === 'function') {
        parameters = { type: 2, ...this.pagination, ...parameters }

        this.dataSource(parameters).then((result) => {
          const { records, ...pagination } = result
          this.pagination = pagination
          this.innerSource = records
        })
      }
    },
    // render
    renderColumns () {

    }
  },
  render () {
    return (
      <a-table
        rowKey="id"
        dataSource={this.finalDataSource}
        columns={this.columns}
      />
    )
  }
}
</script>

<style>

</style>
