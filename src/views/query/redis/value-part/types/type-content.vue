<template>
  <div class="redis-value-box">
    <div class="redis-value-box--function-row">
      <slot name="function"></slot>
    </div>
    <div class="redis-value-box--content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="less">
.redis-value-box {
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  overflow: hidden;

  &--content {
    margin-top: 8px;
    flex: 1;
    overflow: hidden;
  }
}
</style>
