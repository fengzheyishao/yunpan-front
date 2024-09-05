<template>
  <VuePdfEmbed
    ref="pdfRef"
    :source="state.url"
    class="pdf-class"
    :page="state.pageNum"
    >

  </VuePdfEmbed>
</template>

<script setup>
import VuePdfEmbed from 'vue-pdf-embed';
import { ref, onMounted } from 'vue';
// import { createLoadingTask } from "vue3-pdfjs";
import { ElLoading } from "element-plus";

const props = defineProps({
  url: {
    type: String,
  },
});

const pdfRef = ref();

const state = ref({
  url: "", // 预览pdf文件地址
  pageNum: 0, // 当前页面
  numPages: 0, // 总页数
});

const initPdf = ()=>{
    const url = '/api' + props.url;
    state.value.url = url;
    // const loading = ElLoading.service({
    //     lock: true,
    //     text: "加载中......",
    //     background: "rgba(0, 0, 0, 0.7)",
    // });
    // const loadingTask = createLoadingTask(state.value.url);
    // loadingTask.promise.then((pdf)=>{
    //     loading.close();
    //     console.log(pdf);
    //     state.value.numPages = pdf.numPages;
    // });
};

onMounted(()=>{
    initPdf();
})

</script>

<style lang="less" scoped>

</style>