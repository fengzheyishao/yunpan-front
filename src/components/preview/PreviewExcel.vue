<template>
  <div v-html="excelContent" class="talbe-info"></div>
</template>

<script setup>
import * as XLSX from "xlsx";
import { ref, getCurrentInstance, onMounted } from "vue";
const { proxy } = getCurrentInstance();

const props = defineProps({
  url: {
    type: String,
  },
});

const excelContent =ref();

const initExcel = async ()=>{
    let res = await proxy.$api.getRequest(props.url, 'arraybuffer');
    if (!res) return;
    let workbook = XLSX.read(new Uint8Array(res), {type: 'array'});
    let worksheet = workbook.Sheets[workbook.SheetNames[0]];
    excelContent.value = XLSX.utils.sheet_to_html(worksheet);
}

onMounted(()=>{
    initExcel();
})
</script>

<style lang="less" scoped>
.talbe-info {
  width: 100%;
  padding: 20px 10px;
  :deep(table) {
    width: 100%;
    border-collapse: collapse;
    td {
      border: 1px solid #ddd;
      border-collapse: collapse;
      padding: 7px;
      height: 30px;
      min-width: 50px;
    }
  }
}
</style>