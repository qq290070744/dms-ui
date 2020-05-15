<script>
import { typeMixins, genUniqueId, ADDED, genColumns } from './type-mixins'

export default {
  mixins: [typeMixins],
  data () {
    return {
      columns: genColumns([{
        title: 'Value',
        dataIndex: 'value',
        scopedSlots: { customRender: 'value' }
      }, {
        title: 'Score',
        dataIndex: 'score',
        scopedSlots: { customRender: 'score' }
      }])
    }
  },
  methods: {
    _initValue () {
      const originValue = this.redisObject ? this.redisObject.value : {}
      this.dataSource = Object.keys(originValue).map(key => ({ key: genUniqueId(), value: key, score: originValue[key], status: '' }))
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
          { this.renderActionButton('zset') }
        </div>
      )
    },
    renderTable () {
      return this._renderTable(['value', 'score'])
    }
  },
  render () {
    const scopedSlots = {
      function: this.renderFuncRow,
      default: this.renderTable
    }
    return (
      <type-content class="redis-value-zset" scopedSlots={scopedSlots}>
      </type-content>
    )
  }
}
</script>
