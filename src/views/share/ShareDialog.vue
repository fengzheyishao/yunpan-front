<template>
  <Dialog
    :show="dialogConfig.show"
    :title="dialogConfig.fileName"
    :showCancel="showCancel"
    width="50%"
    @close="dialogConfig.show = false"
  >
    <div class="share-table">
      <Table
        :colLabel="colLabel"
        :showPagination="true"
        :options="tableOptions"
        :dataSource="tableData"
        :fetch="loadDataList"
        :initFetch="false"
        @rowSelected="rowSelected"
      >
      </Table>
    </div>
  </Dialog>
</template>

<script setup>
import { ref, getCurrentInstance, nextTick, reactive } from "vue";

import useClipboard from "vue-clipboard3";
const { toClipboard } = useClipboard();

const { proxy } = getCurrentInstance();

const tableData = ref({});
const tableOptions = ref({
  extHeight: 50,
  showIndex: true,
  tableHeight: 500
});

const colLabel = [
  {
    prop: "avatar",
    label: "头像",
    scopedSlots: "avatar",
  },
  {
    prop: "userName",
    label: "用户名",
    width: 150,
  },
  {
    label: "下载时间",
    prop: "downloadTime",
    width: 150,
  },
];

const dialogConfig = reactive({
  show: false,
  fileName: "",
  shareId: ""
});

const formData = ref({});
const resultInfo = ref({});
const showCancel = ref(true);
const formDataRef = ref();
const downloadRecords = ref();

const show = (row) => {
  nextTick(() => {
    dialogConfig.fileName = row.fileName;
    dialogConfig.shareId = row.shareId;
    dialogConfig.show = true;
    showCancel.value = true;
    loadDataList()
  });
};

const loadDataList = async () => {
  console.log(dialogConfig)
  let params = {
    shareId: dialogConfig.shareId,
    pageNo: tableData.value.pageNo,
    pageSize: tableData.value.pageSize,
  }
  const res = await proxy.$api.shareDownloadInfo(params)
  if (!res) return
  tableData.value = res
}

defineExpose({ show });
</script>

<style lang="less" scoped></style>
