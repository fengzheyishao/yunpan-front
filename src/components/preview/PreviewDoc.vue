<template>
  <div ref="docRef" class="doc-content">
  </div>
</template>

<script setup>
import * as docx from 'docx-preview'
import { ref, getCurrentInstance, onMounted } from 'vue';

const {proxy} = getCurrentInstance();
const props = defineProps({
    url: {
        type: String,
    },
});

const docRef = ref();

const initDoc = async ()=>{
    let res = await proxy.$api.getRequest(props.url, "blob");
    if (!res) return;
    docx.renderAsync(res, docRef.value);
};

onMounted(()=>{
    initDoc();
});

</script>

<style lang="less" scoped>
.doc-content {
  margin: 0px auto;
  :deep(.docx-wrapper) {
    background: #fff;
    padding: 20px 0px;
  }
  :deep(.docx-wrapper > section.docx) {
    margin-bottom: 0px;
  }
}
</style>