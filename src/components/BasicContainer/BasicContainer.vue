<template>
  <div
    class="basic-container flex-column-1"
    :style="styleContainerName"
    :class="{ 'basic-container-block': block }"
  >
    <div class="basic-container-card flex-column-1" shadow="never">
      <BasicPageHeader v-if="headerTitle" :name="headerTitle">
        <slot name="headerRight" />
      </BasicPageHeader>
      <slot />
    </div>
  </div>
</template>

<script setup>
import BasicPageHeader from "./BasicPageHeader.vue";
import { computed } from "vue";

defineOptions({
  name: "basicContainer",
});

const props = defineProps({
  radius: 10,
  headerTitle: "",
  background: "",
  padding: 20,
  block: false,
});

const styleContainerName = computed(() => {
  return {
    borderRadius: `${props.radius}px`,
    background: props.background,
  };
});
</script>

<style lang="less" scoped>
.basic-container {
  box-sizing: border-box;

  &-block {
    height: 100%;

    .basic-container-card {
      height: 100%;
    }
  }

  &-card {
    width: 100%;
    border-radius: 4px;
    padding: 0 20px;
    border: 1px solid #e4e7ed;
    background-color: #ffffff;
    overflow: hidden;
    color: #303133;
    transition: 0.3s;
  }
}

.flex-column-1 {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
