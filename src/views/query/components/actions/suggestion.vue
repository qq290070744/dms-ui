
<template>
  <a-popover v-model="suggestion.visible" title="优化建议" trigger="click">
    <v-markdown :source="suggestion.content" slot="content" class="ys-suggestions"></v-markdown>
    <a-button type="primary" size="small" @click="clickSuggestions">优化建议</a-button>
  </a-popover>
</template>

<script>
import { sqlSuggestions } from '@/api/work-order'
import ActionMixins from './mixins'
import VMarkdown from 'vue-markdown'
export default {
  mixins: [ActionMixins],
  components: {
    VMarkdown
  },
  data () {
    return {
      suggestion: {
        visible: false,
        sql: '',
        content: ''
      }
    }
  },
  methods: {
    clickSuggestions () {
      const params = this.params()

      if (this.suggestion.sql === params.sql) {
        this.suggestion.visible = true
        return
      }
      sqlSuggestions(params).then((result) => {
        this.suggestion.content = result
        this.suggestion.visible = true
      })
    }
  }
}
</script>

<style lang="less" scoped>

.ys-suggestions {
  padding: 8px;
  width: 400px;
  max-height: 400px;
  overflow: auto;
}

</style>
