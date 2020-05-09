<script>
import { typeMixins, genUniqueId, ADDED, genColumns } from './type-mixins'
import { genHashAction } from './gen-cmd'

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
      const originValue = this.redisObject ? this.redisObject.value : {}
      this.dataSource = Object.keys(originValue).map(key => ({ key: genUniqueId(), field: key, value: originValue[key], status: '' }))
    },
    addRecord () {
      this.dataSource.push(
        { key: genUniqueId(), field: '', value: '', status: ADDED }
      )
    },
    createWorkOrder () {
      console.log(this.modifiedRecords)
      const actions = genHashAction(this.modifiedRecords, this._redisKey)
      console.log(actions)
      return actions
    },
    /**
     * render function
     */
    renderFuncRow () {
      return (
        <div>
          <a-button size="small" onClick={this.addRecord}>添加</a-button>
          <work-order-action disabled={!this._isModified} extraParams={this._params} genActionObject={this.createWorkOrder}/>
        </div>
      )
    },
    renderTable () {
      return this._renderTable(['field', 'value'])
    }
  },
  render () {
    const scopedSlots = {
      function: this.renderFuncRow,
      default: this.renderTable
    }
    return (
      <type-content class="redis-value-hash" scopedSlots={scopedSlots}>
      </type-content>
    )
  }
}
</script>
