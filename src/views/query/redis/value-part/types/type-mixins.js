import { defaultRedisObject } from '../../utils'
import RedisBaseInfo from '../base-info'
import EditableCell from './editable-cell'
import TypeContent from './type-content'
import WorkOrderAction from '../../work-order-action'
import { REDIS_TYPE } from '../../../utils'
import { genActions } from './gen-cmd'

const KEY_PERFIX = '___pd-unique-'
const ADDED = 'added'
const REMOVED = 'removed'
const HEAD_ADDED = 'added-head'
const TAIL_ADDED = 'added-tail'

let uid = 0
const genUniqueId = () => {
  return KEY_PERFIX + uid++
}

export function genColumns (columns) {
  return [
    {
      title: '#',
      width: 60,
      scopedSlots: { customRender: 'index' }
    },
    ...columns,
    {
      title: '操作',
      width: 100,
      scopedSlots: { customRender: 'operation' }
    }
  ]
}

const typeMixins = {
  components: {
    TypeContent,
    EditableCell,
    WorkOrderAction,
    RedisBaseInfo
  },
  data () {
    return {
      REDIS_TYPE,
      tableOptions: {
        pagination: {
          defaultPageSize: 50,
          hideOnSinglePage: true
        },
        ref: 'table',
        bordered: true,
        size: 'small',
        scroll: { y: 0 }
      },
      initTableHeight: 0,
      // {redisKey: [nRecord, record, mKeys]}
      modifiedRecords: {},
      removedRecords: {},
      dataSource: [],
      unshiftDataSource: [],
      pushDataSource: [],
      resetFlag: 0
    }
  },
  props: {
    redisObject: {
      default: defaultRedisObject,
      type: Object
    }
  },
  computed: {
    _redisKey () {
      return this.redisObject && this.redisObject.key
    },
    _params () {
      if (this.redisObject) {
        const { instId, dbName } = this.redisObject
        return {
          inst_id: instId,
          db_name: dbName,
          type: this.REDIS_TYPE
        }
      }
      return {}
    },
    _isModified () {
      const rs = this.modifiedRecords
      const md = Object.keys(rs).filter(k => rs[k] && rs[k][0] && rs[k][0] !== 'normal')
      return !!this.unshiftDataSource.length || !!this.pushDataSource.length || !!md.length
    }
  },
  watch: {
    redisObject: {
      immediate: true,
      handler () {
        uid = 0
        this._initValue()
        this._autoHeight()
        this.modifiedRecords = {}
      }
    }
  },
  methods: {
    _autoHeight () {
      this.$nextTick(() => {
        const tableEl = this.$refs.table.$el
        const pagination = tableEl.querySelector('.ant-table-pagination')
        const tbodyHeightOrigin = (tableEl.querySelector('.ant-table-tbody') || { clientHeight: 0 }).clientHeight
        const theadHeightOrigin = (tableEl.querySelector('.ant-table-thead') || { clientHeight: 0 }).clientHeight
        const tableHeight = tableEl.clientHeight
        const tbodyHeight = tableHeight - theadHeightOrigin - (pagination ? 32 : 0)
        if (tbodyHeightOrigin > this.tableOptions.scroll.y) {
          this.tableOptions.scroll.y = tbodyHeight
          this.initTableHeight = this.tableOptions.scroll.y
        }
      })
    },
    _fixHeight () {
      this._autoHeight()
    },
    _initValue () {},
    _checkModified (n, o) {
      const keys = Object.keys(o)
      for (const k of keys) {
        if (n[k] !== null && n[k] !== o[k]) {
          return true
        }
      }
      return false
    },
    _setNewRecord (index, record, modifiedKey, modifiedValue) {
      const target = this.pushDataSource[index] === record
        ? this.pushDataSource
        : this.unshiftDataSource
      this.$set(target, index, {
        ...record,
        [modifiedKey]: modifiedValue
      })
    },
    _genModified (record, mKey, mVal) {
      const mObj = { [mKey]: mVal }
      const rowKey = record.key
      const prev = this.modifiedRecords[rowKey] || []
      const [, prevObject = {}, prevMKeys = {}] = prev
      prevMKeys[mKey] = mVal !== null
      const nRecord = { ...record, ...prevObject, ...mObj }
      if (this._checkModified(nRecord, record)) {
        this.$set(this.modifiedRecords, rowKey, [record, nRecord, prevMKeys])
      } else {
        this.$delete(this.modifiedRecords, rowKey)
      }
    },
    _removeRecord (record, index) {
      if (this.pushDataSource[index] === record) {
        this.pushDataSource.splice(index, 1)
        return
      }
      if (this.unshiftDataSource === record) {
        this.unshiftDataSource.splice(index, 1)
        return
      }
      this.$set(this.removedRecords, record.key, record)
      this._fixHeight()
    },
    _restoreRecord (record) {
      this.$delete(this.removedRecords, record.key)
    },
    _onSuccess () {
      this.modifiedRecords = {}
      this.resetFlag++
    },
    _genActions (type) {
      return genActions(type, {
        key: this._redisKey,
        modified: this.modifiedRecords,
        push: this.pushDataSource,
        unshift: this.unshiftDataSource,
        removed: Object.values(this.removedRecords)
      })
    },
    // table
    _genSlots (columnNames, added = false) {
      return {
        index: (_text, _record, index) => {
          return <span>{ index + 1 }</span>
        },
        ...(this._renderEditableCell(columnNames, added)),
        operation: (_text, record, index) => {
          return this.removedRecords[record.key]
            ? <a onClick={() => this._restoreRecord(record)}>撤回</a>
            : <a onClick={() => this._removeRecord(record, index)}>删除</a>
        }
      }
    },
    _genProps (dataSource) {
      return { ...this.tableOptions, columns: this.columns, dataSource: dataSource }
    },
    _renderNewRecord (columnNames, dataSource, ref) {
      if (!dataSource || !dataSource.length) {
        return
      }
      const scopedSlots = this._genSlots(columnNames, true)
      const props = { ...this._genProps(dataSource), scroll: { y: 100 } }
      return <a-table ref={ref} key={this._redisKey + '-' + ref} {...{ props, scopedSlots }}/>
    },
    _renderEditableCell (columns, added) {
      return columns.reduce((slots, modifiedKey) => {
        slots[modifiedKey] = (_text, record, index) => {
          const on = {
            'update:status': (_status, modifiedValue = null) => {
              // const modifiedObj = { [modifiedKey]: modifiedValue }
              if (added) {
                this._setNewRecord(index, record, modifiedKey, modifiedValue)
              } else {
                this._genModified(record, modifiedKey, modifiedValue)
              }
            }
          }
          const key = record.key
          const isM = this.modifiedRecords[key] && this.modifiedRecords[key][2][modifiedKey]
          const props = { added, modified: !!isM, removed: !!this.removedRecords[key] }
          return <editable-cell props={props} value={record[modifiedKey]} on={on}></editable-cell>
        }
        return slots
      }, {})
    },
    _renderBaseInfo () {
      return <redis-base-info redisObject={this.redisObject}/>
    },
    _renderTable (columnNames) {
      const scopedSlots = this._genSlots(columnNames)
      const tableOptions = this._genProps(this.dataSource)
      const tableStyle = { margin: '10px 0', overflow: 'hidden' }
      const dataTable = <a-table style={tableStyle} key={this._redisKey + '-' + this.resetFlag} {...{ props: tableOptions }} ref="table" scopedSlots={scopedSlots}/>
      const pushDataTable = this._renderNewRecord(columnNames, this.pushDataSource, 'pushTable')
      const unshiftDataTable = this._renderNewRecord(columnNames, this.unshiftDataSource, 'unshiftTable')
      const style = {
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }
      return <div style={style}>
        {unshiftDataTable}
        {dataTable}
        {pushDataTable}
      </div>
    },
    renderActionButton (type) {
      return <work-order-action
        disabled={!this._isModified}
        extraParams={this._params}
        genActionObject={() => this._genActions(type)}
        title="创建 Redis 工单"
        onSuccess={this._onSuccess}
      />
    },
    renderFuncRow () {
      // mixins 在子类实现
    },
    renderTable () {
      // mixins 在子类实现
    }
  },
  render () {
    const scopedSlots = {
      function: this.renderFuncRow,
      default: this.renderTable,
      base: this._renderBaseInfo,
    }
    return (
      <type-content scopedSlots={scopedSlots}>
      </type-content>
    )
  }
}

export {
  typeMixins,
  genUniqueId,
  ADDED,
  REMOVED,
  HEAD_ADDED,
  TAIL_ADDED,
  KEY_PERFIX
}
