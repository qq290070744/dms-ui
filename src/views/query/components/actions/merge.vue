<template>
  <a-button
    type="primary"
    size="small"
    @click="_action"
  >
    Alter 语句合并
  </a-button>
</template>

<script>
import { mergeAlterSql } from '@/api/work-order'
import ActionMixins from './mixins'
export default {
  mixins: [ActionMixins],
  methods: {
    action: mergeAlterSql
  }
}
</script>
