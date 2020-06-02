import Vue from 'vue'
const Result = Vue.extend({
  props: {
    records: {
      type: Array,
      default () { return [] }
    },
    title: {
      type: Array,
      default () { return [] }
    }
  },
  data () {
    return {
      uid: 0,
      rowKey: '__DMS_QYERY_UID__',
      dataSource: [],
      scroll: { y: 400, x: 1000 }
    }
  },
  computed: {
    columns () {
      return [
        { title: '#', width: 40, customRender: (_text, _record, index) => <span>{ index + 1 }</span> },
        ...this.title.map(title => {
          if (typeof title === 'object') {
            return title
          }
          return {
            title,
            dataIndex: title,
            width: 100
          }
        })
      ]
    }
  },
  watch: {
    records: {
      immediate: true,
      handler () {
        this.dataSource = this.records.map((data) => {
          return {
            [this.rowKey]: this.uid++,
            ...data
          }
        })
      }
    }
  },
  methods: {
    authScrollHeight () {
      const body = this.$el.querySelector('.ant-table-body')
      if (body) {
        const { top } = body.getBoundingClientRect()
        this.scroll.y = window.innerHeight - top - 16
      }
    }
  },
  render () {
    const { dataSource, columns, rowKey } = this
    return <a-table
      class="mini-row-table"
      props={{
        rowKey,
        bordered: true,
        dataSource,
        columns,
        size: 'small',
        pagination: {
          position: 'top',
        },
        scroll: this.scroll
      }}
    />
  }
})

export default Result
