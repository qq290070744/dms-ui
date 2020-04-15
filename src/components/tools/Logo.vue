<template>
  <div class="logo">
    <router-link :to="{name:'dashboard'}">
      <img src="~@/assets/logo.png" :class="logoClass" alt="logo">
    </router-link>
  </div>
</template>

<script>

export default {
  name: 'Logo',
  props: {
    collapsed: Boolean
  },
  computed: {
    logoClass () {
      return this.collapsed ? ['mini', 'logo-img'] : ['logo-img']
    }
  }
}
</script>

<style lang="less">
.logo-img {
  width: 175px;
  margin-left: 15px;
  margin-top: 0px;
  // clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
  transition: all .3s ease-in-out;
  &.mini {
    width: 200px;
    margin-top: 16px;
    margin-left: -8px;
    clip-path: polygon(0% 0%, 25% 0%, 10% 100%, 0% 100%);
  }
}
</style>
