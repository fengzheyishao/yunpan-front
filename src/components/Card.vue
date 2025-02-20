<template>
  <el-card
    class="card-frame"
    :style="{ maxWidth, maxHeight, minHeight, minWidth }"
  >
    <template #header>
      <div class="header">
        <span class="title">{{ title }}</span>
        <div v-if="img">
          <el-icon><component :is="img" /></el-icon>
        </div>
        <div v-else>
          <el-avatar
            v-if="store.state.avatar != '' || store.state.avatar"
            :size="44"
            :src="getAvatar"
          />
          <el-avatar v-else :size="44" :src="getIconImg()" />
        </div>
      </div>
    </template>
    <template #default>
      <slot />
    </template>
    <template #footer v-if="$slots.footer">
      <slot name="footer" />
      <!-- 添加 footer 插槽 -->
    </template>
  </el-card>
</template>

<script setup>
import { ref, getCurrentInstance, computed } from "vue";
import { useAllDateStores } from "@/stores";

const { proxy } = getCurrentInstance();
const store = useAllDateStores();

const props = defineProps({
  prop: {
    type: Object,
    default: () => ({}),
  },
  maxWidth: {
    type: [String, Number],
    default: "600px",
  },
  maxHeight: {
    type: [String, Number],
    default: "600px",
  },
  minWidth: {
    type: [String, Number],
    default: "100px",
  },
  minHeight: {
    type: [String, Number],
    default: "100px",
  },
  shadow: {
    type: String,
    validator: (value) => {
      return ["always", "hover", "never"].includes(value);
    },
    default: "hover",
  },
  title: {
    type: String,
    default: "",
  },
  img: {
    type: String
  }
});

const getAvatar = computed(() => store.state.avatar);
const getIconImg = () => {
  return new URL(proxy.VueCookies.get("userInfo").avatar, import.meta.url).href;
};
</script>

<style lang="less" scoped>
.card-frame {
  
  :deep(.el-card__header) {
    padding: 5px 20px;
    .header {
      display: flex;
      width: 100%;
      align-items: center;
      justify-content: space-between;
      .title {
        color: #948f8fd8;
        text-align: center;
      }
    }
  }

  :deep(.el-card__footer) {
    padding: 0;
  }
}
</style>
