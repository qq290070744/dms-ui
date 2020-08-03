<template>
  <a-button
    type="danger"
    size="small"
    @click="_action"
  >
    美化
  </a-button>
</template>

<script>
import { beautySql } from '@/api/work-order'
import ActionMixins from './mixins'
export default {
  mixins: [ActionMixins],
  methods: {
    action: beautySql
  }
}
</script>
