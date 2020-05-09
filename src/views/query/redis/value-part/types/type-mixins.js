import { calcTableBodyHeight } from '@/utils/util'
import { defaultRedisObject } from '../../utils'
import EditableCell from './editable-cell'
import TypeContent from './type-content'
import WorkOrderAction from '../work-order-action'
import { REDIS_TYPE } from '../../../utils'

const KEY_PERFIX = '___pd-unique-'
const ADDED = 'added'
const REMOVED = 'removed'
const HEAD_ADDED = 'added-head'
const TAIL_ADDED = 'added-tail'
const MODIFIED = 'modified'

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
      scopedSlots: { customRender: 'operation' }
    }
  ]
}

const typeMixins = {
  components: {
    TypeContent,
    EditableCell,
    WorkOrderAction
  },
  data () {
    return {
      REDIS_TYPE,
      tableOptions: {
        pagination: {
          defaultPageSize: 50
        },
        ref: 'table',
        border: true,
        size: 'small',
        scroll: { y: 0 }
      },
      modifiedRecords: {},
      dataSource: []
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
      return !!md.length
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
      if (this.tableOptions.scroll.y) {
        return
      }
      this.$nextTick(() => {
        this.tableOptions.scroll.y = calcTableBodyHeight(this.$refs.table.$el)
      })
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
    _genModified (record, status, modifiedObj = {}) {
      const rowKey = record.key
      const prev = this.modifiedRecords[rowKey]
      const prevObject = prev ? prev[1] : {}

      const nRecord = { ...record, ...prevObject, ...modifiedObj }
      status = this._checkModified(nRecord, record) ? MODIFIED : status
      console.log(status, nRecord, record)
      const mdRecord = [status, nRecord, record]
      this.$set(this.modifiedRecords, rowKey, mdRecord)
    },
    _renderEditableCell (columns) {
      return columns.reduce((slots, modifiedKey) => {
        slots[modifiedKey] = (_text, record, _index) => {
          const on = {
            'update:status': (status, modifiedValue = null) => {
              const modifiedObj = { [modifiedKey]: modifiedValue }
              this._genModified(record, status, modifiedObj)
            }
          }
          return <editable-cell status={record.status} value={record[modifiedKey]} on={on}></editable-cell>
        }
        return slots
      }, {})
    },
    _removeRecord (record, index) {
      if (record.status === ADDED) {
        this.dataSource.splice(index, 1)
        return
      }
      record.befordStatus = status
      this.$set(record, 'status', REMOVED)
      this._genModified(record, REMOVED)
    },
    _restoreRecord (record) {
      const status = record.befordStatus || ''
      this.$set(record, 'status', status)
      this._genModified(record, status)
    },
    _renderTable (columnNames) {
      const scopedSlots = {
        index: (_text, _record, index) => {
          return <span>{ index + 1 }</span>
        },
        ...(this._renderEditableCell(columnNames)),
        operation: (_text, record, index) => {
          return record.status === 'removed'
            ? <a onClick={() => this._restoreRecord(record)}>撤回</a>
            : <a onClick={() => this._removeRecord(record, index)}>删除</a>
        }
      }
      const tableOptions = { ...this.tableOptions, columns: this.columns, dataSource: this.dataSource }
      return <a-table key={this._redisKey} {...{ props: tableOptions }} ref="table" scopedSlots={scopedSlots}/>
    }
  }
}

export {
  typeMixins,
  genUniqueId,
  ADDED,
  REMOVED,
  HEAD_ADDED,
  TAIL_ADDED
}
