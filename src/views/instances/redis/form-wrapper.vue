<template>
  <div class="y-form-container">
    <a-drawer width="640" :placement="placement" @close="onClose" v-bind="drawer">
      <slot :close="onClose"></slot>
    </a-drawer>
    <slot name="open" :show="showDrawer">
      <a-button @click="showDrawer">
        <slot name="buttonText">创建</slot>
      </a-button>
    </slot>
  </div>
</template>

<script>
export default {
  data () {
    return {
      drawer: {
        maskClosable: false,
        visible: false,
      }
    }
  },
  computed: {
    placement () {
      return this.$attrs.placement || 'right'
    }
  },
  methods: {
    showDrawer () {
      this.drawer.visible = true
    },
    onClose () {
      this.drawer.visible = false
    },
  }
}
</script>

<style>
.y-form-container {
  display: inline-block;
  margin-right: 8px;
}
</style>
