<template>
  <a-tag :color="statusItem.color">{{ statusItem.label }}</a-tag>
</template>

<script>

const STATUS = [
  ['驳回', '#ff6666'],
  ['执行成功', '#00c024'],
  ['待审核', '#2db7f5'],
  ['执行中', '#2db7f5'],
  ['执行失败', '#ff6666'],
  ['撤销', '#f5f5f5']
]
export default {
  props: {
    status: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      STATUS
    }
  },
  computed: {
    statusItem () {
      return this.statusMap[this.status] || {}
    },
    statusMap () {
      return this.STATUS.reduce((map, statusItem, index) => {
        const [label, color] = statusItem
        map[index] = { label, color }
        return map
      }, {})
    }
  }
}
</script>

<style>
</style>
