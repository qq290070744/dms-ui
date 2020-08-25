<template>
  <a-card :title="title" size="small">
    <a-spin :spinning="loading" :delay="200">
      <template v-if="!empty">
        <slot></slot>
      </template>
      <a-empty v-else></a-empty>
    </a-spin>
  </a-card>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: true
    },
    empty: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
.ant-card {
  margin: 8px 0;
}
</style>
