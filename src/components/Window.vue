<template>
 <div class="window-body" v-if="show">
    <div class="window-mask" v-if="show" @click="close"></div>
    <div class="close" @click="close">
        <el-icon><CloseBold /></el-icon>
    </div>
    <div class="window-content"
        :style="{
            top: '0px',
            left: windowContentLeft + 'px',
            width: windowContentWidth + 'px',
        }">
        <div class="title">
            {{ title }}
        </div>
        <div class="content-body">
            <slot></slot>
        </div>
    </div>
 </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';



const props = defineProps({
  show: {
    type: Boolean,
  },
  width: {
    type: Number,
    default: 1000,
  },
  title: {
    type: String,
  },
  align: {
    type: String,
    default: "top",
  },
});

const windowWidth = ref(window.innerWidth);
const windowContentWidth = computed(()=>{
    return props.width>windowWidth.value?windowWidth.value:props.width;
});

const windowContentLeft = computed(()=>{
    let left = windowWidth.value - props.width;
    return left >= 0? left/2:0;
});

const emit = defineEmits(['close']);
const close = ()=>{
    emit('close');
};

const resizeWindow = ()=>{
    windowWidth.value = window.innerWidth;
};

onMounted(()=>{
    window.addEventListener('resize', resizeWindow);
});

onUnmounted(()=>{
    window.removeEventListener('resize', resizeWindow);
});

</script>

<style lang="less" scoped>
.window-body {
  .window-mask {
    top: 0px;
    left: 0px;
    width: 100%;
    height: calc(100vh);
    z-index: 200;
    opacity: 0.5;
    background: #000;
    position: fixed;
  }
  .close {
    z-index: 202;
    cursor: pointer;
    position: absolute;
    top: 40px;
    right: 30px;
    width: 44px;
    height: 44px;
    border-radius: 22px;
    background: #606266;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .window-content {
    top: 0px;
    z-index: 201;
    position: absolute;
    background: #fff;
    .title {
      text-align: center;
      line-height: 40px;
      border-bottom: 1px solid #ddd;
      font-weight: bold;
    }
    .content-body {
      height: calc(100vh - 41px);
    //   display: flex;
    //   align-items: center;
    //   justify-content: center;
      overflow: auto;
    }
  }
}
</style>