import Vue from 'vue'
import { genHorizontalScroll } from '@/utils/util'
const hScroll = genHorizontalScroll()

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
      scroll: { y: 400, x: 1000 },
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
            width: 100,
            customRender: (value) => <pre style={{ whiteSpace: 'pre-wrap' }}>{value}</pre>
          }
        })
      ]
    }
  },
  watch: {
    records: {
      immediate: true,
      handler () {
        this.dataSource = (this.records || []).map((data) => {
          return {
            [this.rowKey]: this.uid++,
            ...data
          }
        })
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      hScroll.add(this.$el, this.$el.querySelector('.ant-table-body'))
    })
  },
  beforeDestroy () {
    hScroll.remove()
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
          showSizeChanger: true,
          pageSizeOptions: ['10', '50', '100', '200']
        },
        scroll: this.scroll
      }}
    />
  }
})

export default Result
