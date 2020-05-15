<script>
import { typeMixins, genUniqueId, genColumns } from './type-mixins'
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
    add () {
      this.pushDataSource.push(
        { key: genUniqueId(), value: '', status: 'added' }
      )
      this._fixHeight()
    },
    renderTable () {
      return this._renderTable(['value'])
    },
    renderFuncRow () {
      return (
        <div>
          <a-button size="small" onClick={this.add}>添加</a-button>
          { this.renderActionButton('set') }
        </div>
      )
    },
  },
  render () {
    const scopedSlots = {
      function: this.renderFuncRow,
      default: this.renderTable
    }
    return (
      <type-content class="redis-value-list" scopedSlots={scopedSlots}>
      </type-content>
    )
  }
}
</script>
