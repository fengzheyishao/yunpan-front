<template>
  <Dialog :show="dialogConfig.show" :title="dialogConfig.fileName" :showCancel="showCancel" width="50%"
    @close="dialogConfig.show = false">
    <div class="share-table">
      <Table :colLabel="colLabel" :showPagination="true" :options="tableOptions" :dataSource="tableData"
        :fetch="loadDataList" :initFetch="false" @rowSelected="rowSelected">
      </Table>
    </div>
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
    prop: "loginDate",
    label: "登录日期",
    align: "center",
  },
  {
    label: "最后登录时间",
    prop: "loginLastDate",
    align: "center",
  },
  {
    prop: "loginCount",
    label: "登录次数",
    align: "center",
  },
];

const dialogConfig = reactive({
  show: false,
  nickName: ''
});

const showCancel = ref(true);

const show = (row) => {
  nextTick(() => {
    dialogConfig.show = true;
    dialogConfig.nickName = row.nickName
    showCancel.value = true;
    loadDataList();
  });
};

const loadDataList = async () => {
  let params = {
    pageNo: tableData.value.pageNo,
    pageSize: tableData.value.pageSize,
  };
  const res = await proxy.$api.userLoginInfoLoadDataList(params);
  if (!res) return;
  tableData.value = res;
};

defineExpose({ show });
</script>

<style lang="less" scoped></style>
