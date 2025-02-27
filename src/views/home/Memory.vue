<template>
  <div class="flex-row-1">
    <BasicContainer :block="true" headerTitle="申请内存" :padding="10">
      <List
        ref="memoryListRef"
        :titleSearch="listPageData.titleSearch"
        :searchList="listPageData.searchList"
        :listHeadData="listPageData.listHeadData"
        :requestListData="requestListData"
        style="padding: 0"
        @row-dblclick="dbClick"
        @selection-change="selectionChange"
      >
        <template #operation="{ row, index }">
          <el-button
            size="small"
            @click="applyMemoryDialogRef.show('second', row, refreshList)"
            >重新申请</el-button
          >
        </template>
        <template #tableHeader>
          <div class="mt10">
            <ButtonList :btnList="buttonList" />
          </div>
        </template>
      </List>
    </BasicContainer>
    <ApplyMemoryDialog ref="applyMemoryDialogRef" />
  </div>
</template>

<script setup>
import BasicContainer from "@/components/BasicContainer/BasicContainer.vue";
import ApplyMemoryDialog from "./ApplyMemoryDialog.vue";
import List from "@/components/ListPage/List.vue";
import { reactive, ref, getCurrentInstance, h } from "vue";

const { proxy } = getCurrentInstance();
const tableSelected = ref([]);
const searchParams = ref({});

const memoryListRef = ref();
const applyMemoryDialogRef = ref();

const buttonList = [
  {
    type: "primary",
    name: "删除请求",
    show: true,
    plain: false,
    evt: ({ name }) => {
      if (!tableSelected.value.length) {
        proxy.Message.warning("请选择需要操作的数据");
        return true;
      }
      confirmMsg({
        title: "删除",
        msgTitle: "申请内存删除吗？",
        msgContent: "您当前选中x条申请内存，删除后不可恢复，请谨慎操作。",
        callback: async (ids) => {
          const res = await proxy.$api.deleteUserMemoryRequestById({
            userIds: ids,
          });
          if (!res) return;
          proxy.Message.success("删除成功");
          refreshList()
        },
      });
    },
  },
  {
    type: "primary",
    name: "申请内存",
    show: true,
    plain: false,
    evt: ({ name }) => {
      applyMemoryDialogRef.value.show("first");
    },
  },
];

// 状态选项
const statusOption = [
  { label: "待批准", value: 0 },
  { label: "已批准", value: 1 },
  { label: "已拒绝", value: 2 },
];

const listPageData = reactive({
  titleSearch: [
    {
      type: "date-picker",
      prop: "requestTime",
      props: {
        type: "daterange",
        rangeSeparator: "至",
        startPlaceholder: "开始日期",
        endPlaceholder: "结束日期",
        valueFormat: "YYYY-MM-DD",
      },
    },
    {
      type: "select",
      prop: "status",
      props: {
        placeholder: "请选择",
        options: statusOption,
      },
    },
  ],
  listHeadData: [
    { prop: "selection", fixed: "left", width: "55" },
    {
      prop: "requestTime",
      label: "申请时间",
    },
    {
      prop: "requestSize",
      label: "申请内存大小",
      formatter: (val) => {
        return proxy.Utils.size2Str(val * 1024 * 1024);
      },
    },
    {
      prop: "rejectionReason",
      label: "审批时间",
      formatter: (val) => {
        if (!val) return "尚未审批";
        return val;
      },
    },
    {
      prop: "status",
      label: "申请状态",
      tag: "true",
      formatter: (val) => {
        switch (val) {
          case 0:
            return "待批准";
          case 1:
            return "已批准";
          default:
            return "已拒绝";
        }
      },
      tagType: (value) => {
        switch (value) {
          case 0:
            return "info";
          case 1:
            return "success";
          default:
            return "error";
        }
      },
    },
    {
      prop: "operation",
      fixed: "right",
      label: "操作",
    },
  ],
  searchList: [],
});

const confirmMsg = ({
  noSelect = false,
  title,
  msgTitle,
  msgContent,
  callback,
}) => {
  if (!tableSelected.value.length && !noSelect) {
    proxy.Message.warning("请选择需要操作的数据");
    return;
  }
  proxy.Message.confirm({
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    title,
    message: h("div", null, [
      h("p", { style: "color: #323232" }, `您确定要将该${msgTitle}`),
      h(
        "p",
        { style: "color: #909399" },
        msgContent.replace("x", tableSelected.value.length)
      ),
    ]),
    type: "warning",
    callback: (action) => {
      if (action === "confirm") {
        const ids = tableSelected.value.map((item) => item.id);
        callback && callback(ids);
      }
    },
  });
};

const requestListData = (params) => {
  const { requestTime, ...data } = params;
  const query = {
    ...data,
  };
  if (requestTime) {
    Object.assign(query, {
      requestTimeStart: requestTime ? `${requestTime[0]} 00:00:00` : "",
      requestTimeEnd: requestTime ? `${requestTime[1]} 23:59:59` : "",
    });
  }
  searchParams.value = query;
  return proxy.$api
    .userMemoryRequestLoadDataList(query)
    .then((res) => {
      searchParams.value.total = res.totalCount;
      return {
        listData: res.list,
        pageSize: res.pageSize,
        total: res.totalCount,
      };
    })
    .catch((e) => {
      console.log(e);
    });
};

const dbClick = (row) => {
  applyMemoryDialogRef.value.show("read", row, refreshList);
};

const selectionChange = (val) => {
  tableSelected.value = val;
};

const refreshList = () => {
  memoryListRef.value.searchClick();
};
</script>

<style lang="less" scoped>
.flex-row-1 {
  display: flex;
  flex-direction: row;
  flex: 1;
}

.mt10 {
  margin-top: 10px;
}
</style>
