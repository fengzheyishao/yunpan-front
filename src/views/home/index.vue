<template>
  <div class="div-body">
    <div class="div-header">
      <Card style="flex: 1" shadow="always" title="个人资料" maxWidth="35%" maxHeight="100%">
        <template #default>
          <el-form class="user-info" :model="userInfoData" ref="userInfoDataRef" label-width="140px" @submit.prevent>
            <el-form-item label="昵称" prop="userInfoData.nickName">
              <el-input v-model="userInfoData.nickName" style="width: 60%" />
            </el-form-item>
            <el-form-item label="注册时间" prop="userInfoData.joinTime">
              {{ userInfoData.joinTime }}
            </el-form-item>
            <el-form-item label="最后登录" prop="userInfoData.lastLoginTime">
              {{ userInfoData.lastLoginTime }}
            </el-form-item>
          </el-form>
        </template>
        <template #footer>
          <ButtonList :btnList="userInfobtnList" flex justifyContent="end" />
        </template>
      </Card>
      <Card style="flex: 4; margin-left: 30px" shadow="always" title="空间分析" img="TrendCharts" maxWidth="60%"
        maxHeight="100%">
        <template #default>
          <div class="chart">
            <v-chart autoresize :option="fileChartOption" style="max-height: 500px"></v-chart>
            <div class="space-class">
              <el-progress :stroke-width="10" width="100" type="dashboard" :color="progressColor"
                :percentage="spacePercent">
                <template #default="{ percentage }">
                  <span :style="{
                    'font-size': '20px',
                    color: percentage > 50 ? 'red' : 'green',
                  }">{{ percentage }}%
                  </span>
                </template>
              </el-progress>
              <span>{{ spaceString }}</span>
            </div>
          </div>
        </template>
        <template #footer>
          <ButtonList :btnList="chartList" flex justifyContent="end" />
        </template>
      </Card>
    </div>
    <div class="div-footer">
      <Card minWidth="100%" maxHeight="90%" title="用户分析(仅展示距离剩余时间还有15天)" img="Flag">
        <template #default>
          <div class="login-info">
            <div class="table">
              <Table :showPagination="false" :colLabel="columns" :options="tableOptions" :dataSource="tableData"
                :fetch="loadDataList">
                <template #fileName="{ row }">
                  <div class="table-cell" :title="row.fileName">{{ row.fileName }}</div>
                </template>
                <template #expireTime="{ row }">
                  <div class="table-cell" :title="row.expireTime">{{ row.expireTime }}</div>
                </template>
                <template #haveTime="{ row }">
                  <div class="table-cell">{{ formatRemainingDays(row.expireTime) }}</div>
                </template>
                <template #operation="{ row }">
                  <el-button round small>延长</el-button>
                </template>
              </Table>
            </div>
            <div class="card">
              <el-col>
                <template v-for="(row, index) in tipArray" :key="index">
                  <el-row style="margin: 15%">
                    <el-statistic :value="tipInfoDate[row.allCount]">
                      <template #title>
                        <div style="display: inline-flex; align-items: center">
                          {{ row.tooltip }}
                          <el-tooltip effect="dark" :content="`今日${row.tooltip}为${tipInfoDate[row.curCount]}`"
                            placement="top">
                            <el-icon style="margin-left: 4px" :size="12">
                              <Warning />
                            </el-icon>
                          </el-tooltip>
                        </div>
                      </template>
                    </el-statistic>
                    <div class="statistic-footer">
                      <div class="footer-item">
                        <span>{{ row.footer }}</span>
                        <span :class="getFileTipColor(row.yesterdayCount, row.curCount)">
                          {{ getFileTipText(row.yesterdayCount, row.curCount) }}%
                          <el-icon>
                            <Line v-if="getFileTipColor(row.yesterdayCount, row.curCount).length===0"/>
                            <CaretTop v-else-if="getFileTipColor(row.yesterdayCount, row.curCount)[0] === 'green'"/>
                            <CaretBottom v-else/>
                          </el-icon>
                        </span>
                      </div>
                    </div>
                  </el-row>
                </template>
              </el-col>
            </div>
            <div class="month-hot">
              <MonthHot />
              <div class="date-info">
                <span>您好，现在是<i style="color:dimgray">{{ curDateTime }}</i></span>
                <span style="margin-left: 20px;"><el-button round>查看详细记录</el-button></span>
              </div>
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, getCurrentInstance, computed, onBeforeUnmount } from "vue";
import { useAllDateStores } from "@/stores";
import TimeUtils from "@/utils/TimeUtils";

const { proxy } = getCurrentInstance();
const store = useAllDateStores();

const userInfoDataRef = ref();
const userInfoData = reactive({});

const userInfobtnList = [
  {
    name: "修改用户名",
    show: true,
    prop: {
      size: "small",
    },
    evt: async () => { 
      let params = {
        nickname: userInfoData.nickName.trim()
      }
      const res = await proxy.$api.resetNickname(params)
      if (!res) {
        
        return
      }
      
    },
  },
  {
    name: "修改头像",
    show: true,
    prop: {
      size: "small",
    },
    evt: () => {
      proxy.$bus.$emit("updateAvatar");
    },
  },
];

const chartList = [
{
    name: "签到",
    show: true,
    prop: {
      size: "small",
    },
    evt: async () => { },
  },
  {
    name: "申请内存",
    show: true,
    prop: {
      size: "small",
    },
    evt: async () => { },
  },
];

const tableData = ref({});

const tipInfoDate = reactive({})

const tipArray = [
  {
    tooltip: '下载次数',
    prop: 'downLoadCount',
    allCount: 'allDownLoadCount',
    yesterdayCount: 'downLoadYesCount',
    curCount: 'downLoadCurCount',
    footer: 'than yesterday'
  },
  {
    tooltip: '浏览次数',
    prop: 'showCount',
    allCount: 'allshowCount',
    yesterdayCount: 'showCountYesCount',
    curCount: 'showCountCurCount',
    footer: 'than yesterday'
  },
  {
    tooltip: '文件数量',
    prop: 'fileCount',
    allCount: 'allFileCount',
    yesterdayCount: 'fileYesCount',
    curCount: 'fileCurCount',
    footer: 'than yesterday'
  },
]

const columns = [
  {
    label: "文件名",
    prop: "fileName",
    scopedSlots: "fileName",
    width: 150,
  },
  {
    label: "浏览次数",
    prop: "showCount",
    extend: {
      sortable: true,
    },
    width: 110,
  },
  {
    label: "失效时间",
    prop: "expireTime",
    scopedSlots: "expireTime",
    width: 140,
  },
  {
    label: "剩余时间",
    scopedSlots: "haveTime",
    extend: {
      sortable: true,
    },
  },
  {
    label: "操作",
    scopedSlots: "operation",
    extend: {
      fixed: 'right'
    },
    width: 80,
  }
]

const getFileTipColor = (yesterday, today) => {
  const yesData = tipInfoDate[yesterday]
  const curData = tipInfoDate[today]
  if (!curData || curData == 0) return []
  if (curData >= yesData) return ['green']
  return ['red']
}

const getFileTipText = (yesterday, today) => {
  const yesData = tipInfoDate[yesterday]
  const curData = tipInfoDate[today]
  if (!curData || curData == 0) return 0
  if (curData > yesData) return (yesData/curData*100).toFixed(2)
  return (curData/yesData*100).toFixed(2)
}

const fileMemoryInfo = ref([]);

const getFileMemoryInfo = async () => {
  fileMemoryInfo.value.length = 0;
  const res = await proxy.$api.getFileMemoryAnalysis();
  if (!res) return;
  for (const key in res) {
    fileMemoryInfo.value.push(
      Object.assign({
        name: key,
        value: res[key],
      })
    );
  }
};

const getFileTipDate = async () => {
  const res = await proxy.$api.getFileTipInfo();
  if (!res) return
  Object.assign(tipInfoDate, res)
}

const fileChartOption = reactive({
  tooltip: {
    trigger: "item",
    formatter: (params) => {
      const formattedSize = proxy.Utils.size2Str(params.data.value); // 使用 size2Str 方法格式化
      return `${params.seriesName} <br/>${params.name}: ${formattedSize} (${params.percent}%)`;
    },
  },
  legend: {
    orient: "vertical",
    left: "left",
  },
  series: [
    {
      name: "文件类型",
      type: "pie",
      radius: "50%",
      data: fileMemoryInfo.value,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
      },
    },
  ],
  color: ["#ff6384", "#36a2eb", "#cc65fe", "#ffce56", "#4bc0c0"],
});

const spaceString = computed(
  () =>
    proxy.Utils.size2Str(store.state.spacePercent.useSpace) +
    "/" +
    proxy.Utils.size2Str(store.state.spacePercent.totalSpace)
);

const spacePercent = computed(() => {
  return (
    Math.floor(
      (store.state.spacePercent.useSpace /
        store.state.spacePercent.totalSpace) *
      10000
    ) / 100
  );
});

const showUploader = computed(() => store.state.showUploaderPlanel);

const curDateTime = ref(new Date().toLocaleString());
let timer = null; // 声明计时器变量

const progressColor = computed(() => {
  if (showUploader.value <= 60) return "green";
  else if (showUploader.value <= 80) return "yellow";
  else return "red";
});

const tableOptions = ref({
  tableHeight: 330,
  extHeight: 10,
  selectType: "checkbox",
});

const loadDataList = async () => {
  const date = new Date()
  date.setDate(date.getDate() + 15);
  let parmas = {
    expireTimeEnd: TimeUtils.formatTime(date, 'yyyy-MM-dd HH:mm:ss')
  }
  let res = await proxy.$api.loadExpireShareList(parmas);
  if (!res) {
    return;
  }
  tableData.value = res;
};

const formatRemainingDays = (expireTime) => {
  const currentTime = new Date();
  const dateTime = expireTime.split(' ')
  dateTime[1] = dateTime[1].replace(/-/g, ':')
  const expireDate = new Date(dateTime.join('T'))
  const timeDiff = expireDate - currentTime; // 计算时间差（毫秒）
  console.log(expireDate, timeDiff)

  const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // 转换为天数并向上取整
  return daysRemaining < 1 ? "小于1天" : `${daysRemaining}天`;
};

onMounted(async () => {
  store.reloadSpacePercent();
  const userInfo = proxy.VueCookies.get("userInfo");
  Object.assign(userInfoData, userInfo);
  await getFileMemoryInfo();
  await getFileTipDate()

  timer = setInterval(() => {
    curDateTime.value = new Date().toLocaleString();
  }, 1000);
});

onBeforeUnmount(() => {
  clearInterval(timer);
});

</script>

<style lang="less" scoped>
.div-body {
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  padding: 15px;
  margin: 0;
  overflow-y: auto;

  .div-header {
    display: inline-flex;
    justify-content: space-between;
    flex: 1;
    margin: 10px;

    .user-info {
      :deep(.el-input__inner) {
        color: rgba(100, 120, 140, 0.8);
        font-size: 0.9em;
      }

      :deep(.el-form-item__label) {
        color: rgba(80, 100, 120, 0.9);
        font-size: 1em;
      }

      :deep(.el-form-item__content) {
        color: rgba(100, 120, 140, 0.8);
        font-size: 0.9em;
      }
    }

    .chart {
      display: flex;

      max-height: 350px;
      height: 180px;

      .space-class {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-right: 15%;
        margin-top: 45px;

        span {
          font-size: 1.2em;
          line-height: 30px;
          align-items: center;
        }
      }
    }
  }

  .div-footer {
    display: flex;
    flex: 2;
    padding: 10px;

    .login-info {
      display: flex;
      flex: 1;
      height: 100%;

      .table {
        flex: 7;


      }

      .card {
        flex: 4;
      }

      .month-hot {
        flex: 4;

        .date-info {
          display: block;

          span {
            line-height: 40px;
            font-size: large;
          }
        }
      }


    }
  }
}

.table-cell {
  line-height: 40px;
  height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.statistic-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  font-size: 12px;
  color: var(--el-text-color-regular);
  margin-top: 16px;
}

.statistic-footer .footer-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.statistic-footer .footer-item span:last-child {
  align-items: center;
  margin-left: 4px;
}

.green {
  color: var(--el-color-success);
}

.red {
  color: var(--el-color-error);
}
</style>
