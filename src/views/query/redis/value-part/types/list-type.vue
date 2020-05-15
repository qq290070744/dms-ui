<script>
import { typeMixins, genUniqueId, genColumns, HEAD_ADDED, TAIL_ADDED } from './type-mixins'
export default {
  mixins: [typeMixins],
  data () {
    return {
      columns: genColumns([{
        title: 'Value',
        dataIndex: 'value',
        scopedSlots: { customRender: 'value' }
      }])
    }
  },
  methods: {
    _initValue () {
      const originValue = this.redisObject ? this.redisObject.value : []
      this.dataSource = originValue.map((value, index) => ({ key: genUniqueId(), index, value, status: '' }))
    },
    headAdd () {
      this.unshiftDataSource.unshift(
        { key: genUniqueId(), value: '', status: HEAD_ADDED }
      )
      this._fixHeight()
    },
    tailAdd () {
      this.pushDataSource.push(
        { key: genUniqueId(), value: '', status: TAIL_ADDED }
      )
      this._fixHeight()
    },
    renderTable () {
      return this._renderTable(['value'])
    },
    renderFuncRow () {
      return (
        <div>
          <a-button size="small" onClick={this.headAdd}>头部新增</a-button>
          <a-button size="small" onClick={this.tailAdd}>尾部新增</a-button>
          { this.renderActionButton('list') }
        </div>
      )
    },
  }
}
</script>
