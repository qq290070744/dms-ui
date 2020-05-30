<template>
  <div>
    <a-input-search placeholder="请输入图标名称" allowClear @change="handleChange" />
    <div class="icon-list">
      <div v-for="(item, idx) in iconList" :key="idx" @click="selectIcon(item)">
        <a-icon :type="item" :style="{ fontSize: '16px' }" />
        <span>{{ item }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import icons from '../IconSelector/icons'
const iconList = icons.reduce((t, v) => {
  if (v.key === 'brand_logo' || v.key === 'data' || v.key === 'suggested') {
    t = t.concat(v.icons)
  }
  return t
}, [])

export default {
  name: 'IconSelect',
  data() {
    return {
      iconList
    }
  },
  methods: {
    handleChange(e) {
      const value = e.target.value
      if (value) {
        this.iconList = iconList.filter(item => item.includes(value))
      } else {
        this.iconList = iconList
      }
    },
    selectIcon(icon) {
      this.$emit('selectIcon', icon)
    }
  }
}
</script>

<style lang="less" scoped>
.icon-list {
  height: 190px;
  overflow: auto;
  display: flex;
  flex-wrap: wrap;
  margin-top: 15px;
  justify-content: flex-start;
  > div {
    margin-bottom: 10px;
    width: 33.3%;
    display: flex;
    align-items: center;
    cursor: pointer;
    > span {
      margin-left: 8px;
    }
  }
}
</style>
