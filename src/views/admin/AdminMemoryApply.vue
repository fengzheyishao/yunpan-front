<template>
  <div class="flex-row-1">
    <BasicContainer :block="true" headerTitle="空间申请" :padding="10">
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
          <el-button size="small">审批</el-button>
        </template>
        <template #tableHeader>
          <div class="mt10">
            <ButtonList :btnList="buttonList" />
          </div>
        </template>
      </List>
    </BasicContainer>
  </div>
</template>

<script setup>
import BasicContainer from "@/components/BasicContainer/BasicContainer.vue";
import List from "@/components/ListPage/List.vue";
import { reactive, ref, getCurrentInstance } from "vue";

const { proxy } = getCurrentInstance();
const tableSelected = ref([]);
const searchParams = ref({});

const memoryListRef = ref();
const buttonList = [];

const statusOption = [
  { label: "待批准", value: 0 },
  { label: "已批准", value: 1 },
  { label: "已拒绝", value: 2 },
];

const listPageData = reactive({
  titleSearch: [
    {
      type: "input",
      prop: "nickNameFuzzy",
      props: {
        placeholder: "请输入用户名称",
      },
    },
    {
      type: "select",
      prop: "status",
      props: {
        placeholder: "请选择申请状态",
        options: statusOption,
      },
    },
  ],
  listHeadData: [
    { prop: "selection", fixed: "left", width: "55" },
    {
      prop: "nickName",
      label: "用户名称",
    },
    {
      prop: "requestTime",
      label: "申请时间",
      search: {
        type: "date-picker",
        props: {
          type: "daterange",
          rangeSeparator: "至",
          startPlaceholder: "开始日期",
          endPlaceholder: "结束日期",
          valueFormat: "YYYY-MM-DD",
        },
      },
    },
    {
      prop: "requestSize",
      label: "申请内存大小",
      search: {
        type: "input",
        props: {
          placeholder: "请输入大于内存",
        },
      },
    },
    {
      prop: "rejectionReason",
      label: "审批时间",
      formatter: (val) => {
        if (!val) return "尚未审批";
        return val;
      },
      search: {
        type: "date-picker",
        props: {
          type: "daterange",
          rangeSeparator: "至",
          startPlaceholder: "开始日期",
          endPlaceholder: "结束日期",
          valueFormat: "YYYY-MM-DD",
        },
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
            "已拒绝";
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

const requestListData = (params) => {
  const { requestTime, rejectionReason, ...data } = params;
  const query = {
    ...data,
  };
  if (requestTime) {
    Object.assign(query, {
      requestTimeStart: requestTime ? `${requestTime[0]} 00:00:00` : "",
      requestTimeEnd: requestTime ? `${requestTime[1]} 23:59:59` : "",
    });
  }
  if (rejectionReason) {
    Object.assign(query, {
      rejectionReasonStart: rejectionReason
        ? `${rejectionReason[0]} 00:00:00`
        : "",
      rejectionReasonEnd: rejectionReason
        ? `${rejectionReason[1]} 23:59:59`
        : "",
    });
  }
  searchParams.value = query;
  return proxy.$api
    .getAdminMemoryApplyList(query)
    .then((res) => {
      searchParams.value.total = res.totalCount;
      console.log(res);
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

const dbClick = (row) => {};

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
