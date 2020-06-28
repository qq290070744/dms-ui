<template>
  <a-result
    status="success"
    title="权限申请成功，请等待审核"
  >
    <template #extra>
      <a-button key="list" type="primary" @click="toList">
        查看申请列表
      </a-button>
      <a-button key="again" @click="again">
        再次申请
      </a-button>
    </template>
  </a-result>
</template>
<script>
export default {
  data() {
    return {}
  },
  methods: {
    again () {
      this.$emit('again')
    },
    toList () {
      this.$emit('to-list')
    }
  }
}
</script>
