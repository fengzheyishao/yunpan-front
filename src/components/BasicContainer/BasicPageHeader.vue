<template>
  <div class="basic-container-header flex-between">
    <span>{{ name }}</span>
    <slot />
  </div>
</template>

<script setup>
defineOptions({
  name: 'pageHeader'
})

const props = defineProps({
  name: ''
})
</script>

<style lang="less" scoped>
.basic-container-header {
  position: relative;
  height: 46px;
  line-height: 46px;
  font-size: 18px;
  font-weight: 500;
  color: #303133;
  padding-left: 10px;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    width: 4px;
    height: 18px;
    transform: translate(0, -50%);
    background: red;
  }
}

.flex-between {
  display: flex;
  justify-content: space-between;
}
</style>
