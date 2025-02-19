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
        <template #avatar="{ index, row }">
          <el-avatar
            style="margin-top: 5px"
            :size="48"
            :src="proxy.$api.getAvatar(row.userId, new Date().getDate())"
          />
        </template>
      </Table>
    </div>
    <span>下载次数: <i style="color: red;">{{ tableData.totalCount }}</i></span>
  </Dialog>
</template>

<script setup>
import { ref, getCurrentInstance, nextTick, reactive } from "vue";

const { proxy } = getCurrentInstance();

const tableData = ref({});
const tableOptions = ref({
  extHeight: 50,
  showIndex: true,
  tableHeight: 500,
});

const colLabel = [
  {
    prop: "avatar",
    label: "头像",
    scopedSlots: "avatar",
    width: 100,
    align: "center",
  },
  {
    prop: "userName",
    label: "用户名",
    align: "center",
  },
  {
    label: "下载时间",
    prop: "downloadTime",
    align: "center",
  },
];

const dialogConfig = reactive({
  show: false,
  fileName: "",
  shareId: "",
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
    loadDataList();
  });
};

const loadDataList = async () => {
  let params = {
    shareId: dialogConfig.shareId,
    pageNo: tableData.value.pageNo,
    pageSize: tableData.value.pageSize,
  };
  const res = await proxy.$api.shareDownloadInfo(params);
  if (!res) return;
  tableData.value = res;
};

defineExpose({ show });
</script>

<style lang="less" scoped></style>
