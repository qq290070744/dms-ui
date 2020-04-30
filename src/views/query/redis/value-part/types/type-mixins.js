import { calcTableBodyHeight } from '@/utils/util'
import { defaultRedisObject } from '../../utils'

const typeMixins = {
  data () {
    return {
      tableOptions: {
        pagination: {
          defaultPageSize: 50
        },
        ref: 'table',
        border: true,
        size: 'small',
        scroll: { y: 0 }
      }
    }
  },
  props: {
    redisObject: {
      default: defaultRedisObject,
      type: Object
    }
  },
  watch: {
    redisObject: {
      immediate: true,
      handler () {
        this._autoHeight()
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
    }
  }
}

export {
  typeMixins
}
