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

const { proxy } = getCurrentInstance()
const tableSelected = ref([])
const searchParams = ref({})

const memoryListRef = ref();

const buttonList = [
  {
    type: "primary",
    name: "重新申请",
    show: true,
    plain: false,
    evt: ({ name }) => {
    },
  },
];

// 状态选项
const statusOption = [
  { label: "待处理", value: 1 },
  { label: "已批准", value: 2 },
  { label: "已拒绝", value: 3 },
];

const listPageData = reactive({
  titleSearch: [
    {
      type: "input",
      prop: "name",
      props: {
        placeholder: "输入人员名字",
      },
    },
  ],
  listHeadData: [
    { prop: "selection", fixed: "left", width: "55" },
    { prop: "index", label: "序号", width: "60" },
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
    },
    {
      prop: "rejectionReason",
      label: "批准时间",
    },
    {
      prop: "status",
      label: "申请状态",
      search: {
        type: "select",
        props: {
          placeholder: "请选择",
          options: statusOption,
        },
      },
    },
  ],
  searchList: [],
});

const requestListData = (params) => {
  const { requestTime, ...data } = params
  const query = {
    ...data
  }
  if (requestTime) {
    Object.assign(query, {
      requestTimeStart: requestTime ? `${requestTime[0]} 00:00:00` : '',
      requestTimeEnd: requestTime ? `${requestTime[1]} 23:59:59` : ''
    })
  }

  searchParams.value = query
  return proxy.$api.userMemoryRequestLoadDataList(query)
    .then((res) => {
      searchParams.value.total = res.totalCount
      return { listData: data.list, pageSize: data.pageSize, total: data.total }
    })
    .catch((e) => {
      console.log(e)
    })
}

const dbClick = (row) => {

}

const selectionChange = (val) => {
  tableSelected.value = val
}

const refreshList = () => {
  memoryListRef.value.searchClick()
}

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
