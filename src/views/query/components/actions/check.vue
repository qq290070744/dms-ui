<template>
  <a-button
    type="danger"
    size="small"
    @click="_action"
  >
    检查语句
  </a-button>
</template>

<script>
import { checkSql } from '@/api/work-order'
import ActionMixins from './mixins'
export default {
  mixins: [ActionMixins],
  props: {
    type: {
      default: 'mysql', // pgsql
      type: String
    }
  },
  methods: {
    action (p) {
      return checkSql(p, this.type)
    }
  }
}
</script>
