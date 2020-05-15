import StringType from './string-type'
import HashType from './hash-type'
import ZsetType from './zset-type'
import SetType from './set-type'
import ListType from './list-type'
import BaseInfo from '../base-info'
import { defaultRedisObject } from '../../utils'
import EventBus, { REDIS_KEY_CREATED } from '../../event-bus'
export default {
  components: {
    StringType,
    HashType,
    ZsetType,
    SetType,
    ListType,
    BaseInfo
  },
  data () {
    return {
      modified: {
        key: '',
        type: '',
        ttl: '',
        temp: ''
      }
    }
  },
  props: {
    redisObject: {
      default: defaultRedisObject,
      type: Object
    }
  },
  computed: {
    modifiedObject () {
      return Object.keys(this.modified).reduce((obj, key) => {
        if (this.modified[key]) {
          obj[key] = this.modified[key]
        }
        return obj
      }, {})
    },
    finalObject () {
      if (!this.redisObject) { return null }
      return {
        ...this.redisObject,
        ...this.modifiedObject
      }
    },
    type () {
      return this.finalObject ? this.finalObject.type : ''
    },
    ttl () {
      const origin = this.redisObject ? this.redisObject.ttl : ''
      const curr = this.modified.ttl

      return origin === curr ? null : curr
    }
  },
  mounted () {
    EventBus.$on(REDIS_KEY_CREATED, this.closeCreate)
  },
  beforeDestroy () {
    EventBus.$off(REDIS_KEY_CREATED, this.closeCreate)
  },
  methods: {
    closeCreate () {
      this.modified = {
        key: '',
        type: '',
        ttl: '',
        temp: ''
      }
    }
  },
  render () {
    const component = this.type ? this.type.toLowerCase() + '-type' : ''
    const on = {
      change: (modified) => {
        this.modified = modified
      }
    }
    const style = {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }
    if (!this.redisObject) {
      return
    }
    return (
      <div style={style}>
        <base-info redisObject={this.redisObject} on={on}/>
        {
          component ? <component style={{ flex: 1 }} redisObject={this.finalObject} modifiedTtl={this.ttl}/> : undefined
        }
      </div>
    )
  }
}
