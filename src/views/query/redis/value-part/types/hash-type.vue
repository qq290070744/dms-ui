<script>
import { typeMixins, genUniqueId, ADDED, genColumns } from './type-mixins'

export default {
  mixins: [typeMixins],
  data () {
    return {
      columns: genColumns([{
        title: 'Field',
        dataIndex: 'field',
        scopedSlots: { customRender: 'field' }
      }, {
        title: 'Value',
        dataIndex: 'value',
        scopedSlots: { customRender: 'value' }
      }])
    }
  },
  methods: {
    _initValue () {
      const originValue = this.redisObject ? (this.redisObject.value || {}) : {}
      this.dataSource = Object.keys(originValue).map(key => ({ key: genUniqueId(), field: key, value: originValue[key], status: '' }))
    },
    addRecord () {
      this.pushDataSource.push(
        { key: genUniqueId(), field: '', value: '', status: ADDED }
      )
      this._fixHeight()
    },
    /**
     * render function
     */
    renderFuncRow () {
      return (
        <div>
          <a-button size="small" onClick={this.addRecord}>添加</a-button>
          { this.renderActionButton('hash') }
        </div>
      )
    },
    renderTable () {
      return this._renderTable(['field', 'value'])
    }
  }
}
</script>
