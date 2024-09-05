<template>
    <div class="image-viewer">
        <el-image-viewer
        :url-list="imageList"
        :initial-index="previewImgIndex"
        hide-on-click-modal
        @close="closeImgViewer"
        v-if="previewImgIndex!=null"
        >
        </el-image-viewer>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const prosp = defineProps({
  imageList: {
    type: Array,
  },
});

//禁止滚动
const stopScroll = () => {
  document.body.style.overflow = "hidden";
};

// 开始滚动
const startScroll = () => {
  document.body.style.overflow = "auto";
};

const show = (index) => {
  stopScroll();
  previewImgIndex.value = index;
};

defineExpose({show,});

const previewImgIndex = ref(null);

const closeImgViewer = ()=>{
    startScroll();
    previewImgIndex.value = null;
}

</script>

<style lang="less" scoped>
.image-viewer {
  .el-image-viewer__mask {
    opacity: 0.7;
  }
}
</style>