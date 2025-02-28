<template>
  <BasicContainer :block="true" headerTitle="日志请求" :padding="10">
    <List
      ref="listRef"
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
    <LogFormDialog ref="logFormDialogRef" />
  </BasicContainer>
</template>

<script setup>
import List from "@/components/ListPage/List.vue";
import BasicContainer from "@/components/BasicContainer/BasicContainer.vue";
import { useAllDateStores } from "@/stores";
import { ref, h, reactive, getCurrentInstance } from "vue";
import Icon from "@/components/Icon.vue";
import LogFormDialog from "./LogFormDialog.vue";

const { proxy } = getCurrentInstance();
const store = useAllDateStores();

const tableSelected = ref([]);

const listRef = ref();
const logFormDialogRef = ref();

const searchParams = ref({});

const buttonList = [
  {
    show: () => {
      return true;
    },
    type: "error",
    name: "批量删除",
    icon: "CirclePlus",
    plain: false,
    evt: ({ name }) => {
      if (!tableSelected.value.length) {
        proxy.Message.warning("请选择需要操作的数据");
        return true;
      }
      confirmMsg({
        title: "删除",
        msgTitle: "日志删除吗？",
        msgContent: "您当前选中x条日志信息，删除后不可恢复，请谨慎操作。",
        callback: async (ids) => {
          const res = await proxy.$api.deleteRequestLogById({
            ids: ids,
          });
          if (!res) return;
          proxy.Message.success("删除成功");
          refreshList();
        },
      });
    },
  },
  {
    show: () => {
      return true;
    },
    type: "error",
    name: "按查询条件删除",
    icon: "CirclePlus",
    plain: false,
    evt: ({ name }) => {
      proxy.Message.confirm({
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        title: "按查询条件删除日志信息",
        message: h(
          "div",
          null,
          h("p", { style: "color: #323232" }, "注意查询条件")
        ),
        type: "warning",
        callback: async (action) => {
          if (action === "confirm") {
            saveSearchParams();
            const res = await proxy.$api.deleteRequestLogByQuery({
              ...searchParams.value,
            });
            if (!res) return;
            proxy.Message.success("删除成功");
            refreshList();
          }
        },
      });
    },
  },
];

const requestMethodOptions = [
  { value: "GET" },
  { value: "POST" },
  { value: "PUT" },
  { value: "DELETE" },
];

const listPageData = reactive({
  titleSearch: [
    {
      type: "input",
      prop: "urlFuzzy",
      props: {
        placeholder: "输入URL",
      },
    },
  ],
  listHeadData: [
    { prop: "selection", fixed: "left", width: "55" },
    { prop: "index", label: "序号", width: "60" },
    {
      prop: "url",
      label: "url地址",
      minWidth: "110",
    },
    {
      prop: "method",
      label: "请求方法",
      minWidth: "110",
      search: {
        type: "select",
        props: {
          placeholder: "输入请求方法",
          options: requestMethodOptions,
        },
      },
    },
    {
      prop: "requestHeaders",
      label: "请求头",
      minWidth: "110",
      search: {
        type: "input",
        props: {
          placeholder: "输入请求头",
        },
      },
    },
    {
      prop: "requestBody",
      label: "请求体",
      minWidth: "110",
      search: {
        type: "input",
        props: {
          placeholder: "输入请求体",
        },
      },
    },
    {
      prop: "responseStatus",
      label: "状态码",
      minWidth: "110",
      search: {
        type: "input",
        props: {
          placeholder: "输入状态码",
        },
      },
    },
    {
      prop: "responseBody",
      label: "响应体",
      minWidth: "110",
    },
    {
      prop: "timestamp",
      label: "时间戳",
      minWidth: "110",
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
      prop: "logStatus",
      label: "状态",
      fixed: "right",
      tag: true,
      width: "90",
      formatter: (value) => {
        switch (value) {
          case 1:
            return "临时";
          case 2:
            return "成功";
          case 3:
            return "异常";
          default:
            return "其他";
        }
      },
      tagType: (value) => {
        switch (value) {
          case 1:
            return "primary";
          case 2:
            return "success";
          case 3:
            return "error";
          default:
            return "info";
        }
      },
      search: {
        type: "select",
        props: {
          placeholder: "状态",
          options: [
            { label: "临时", value: 1 },
            { label: "成功", value: 2 },
            { label: "异常", value: 3 },
            { label: "其他", value: 4 },
          ],
        },
      },
    },
  ],
});

const saveSearchParams = () => {
  const { timestamp, requestHeaders, requestBody, ...data } =
    listRef.value.getSearchData();
  const query = {
    ...data,
  };
  if (requestHeaders) {
    Object.assign(query, {
      requestHeadersFuzzy: requestHeaders,
    });
  }
  if (requestBody) {
    Object.assign(query, {
      requestBodyFuzzy: requestBody,
    });
  }
  if (timestamp) {
    Object.assign(query, {
      timestampStart: timestamp ? `${timestamp[0]} 00:00:00` : "",
      timestampEnd: timestamp ? `${timestamp[1]} 23:59:59` : "",
    });
  }
  searchParams.value = query;
};

const requestListData = (params) => {
  const { timestamp, requestHeaders, requestBody, ...data } = params;
  const query = {
    ...data,
  };
  if (requestHeaders) {
    Object.assign(query, {
      requestHeadersFuzzy: requestHeaders,
    });
  }
  if (requestBody) {
    Object.assign(query, {
      requestBodyFuzzy: requestBody,
    });
  }
  if (timestamp) {
    Object.assign(query, {
      timestampStart: timestamp ? `${timestamp[0]} 00:00:00` : "",
      timestampEnd: timestamp ? `${timestamp[1]} 23:59:59` : "",
    });
  }
  searchParams.value = query;
  return proxy.$api
    .getLogList(query)
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
  logFormDialogRef.value.show(row);
};

const selectionChange = (val) => {
  tableSelected.value = val;
};

const refreshList = () => {
  listRef.value.searchClick();
};

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
        const ids = tableSelected.value.map((item) => item.id).join(",");
        callback && callback(ids);
      }
    },
  });
};
</script>

<style lang="less" scoped></style>
