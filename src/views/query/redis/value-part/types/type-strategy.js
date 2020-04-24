import StringType from './string-type'
import HashType from './hash-type'
import ZsetType from './zset-type'
import SetType from './set-type'
import ListType from './list-type'
import { defaultRedisObject } from '../../utils'
export default {
  components: {
    StringType,
    HashType,
    ZsetType,
    SetType,
    ListType
  },
  props: {
    redisObject: {
      default: defaultRedisObject,
      type: Object
    }
  },
  computed: {
    type () {
      return this.redisObject ? this.redisObject.type : ''
    }
  },
  render () {
    const component = this.type ? this.type.toLowerCase() + '-type' : ''
    return (
      component ? <component redisObject={this.redisObject}></component> : undefined
    )
  }
}
