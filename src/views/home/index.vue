<template>
  <div class="div-body">
    <div class="div-header">
      <Card
        style="flex: 1"
        shadow="always"
        title="个人资料"
        maxWidth="35%"
        maxHeight="100%"
      >
        <template #default>
          <el-form
            class="user-info"
            :model="userInfoData"
            ref="userInfoDataRef"
            label-width="140px"
            @submit.prevent
          >
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
      <Card
        style="flex: 4; margin-left: 30px"
        shadow="always"
        title="空间分析"
        img="TrendCharts"
        maxWidth="60%"
        maxHeight="100%"
      >
        <template #default>
          <div class="chart">
            <v-chart
              autoresize
              :option="fileChartOption"
              style="max-height: 500px"
            ></v-chart>
          </div>
        </template>
      </Card>
    </div>
    <div class="div-footer"></div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, getCurrentInstance } from "vue";
import { useAllDateStores } from "@/stores";

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
    evt: async () => {},
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

const fileMemoryInfo = ref([]);

const getFileMemoryInfo = async () => {
  const res = await proxy.$api.getFileMemoryAnalysis();
  if (!res) return;
  fileMemoryInfo.value.length = 0;
  console.log(res)
  for (const key in res) {
    fileMemoryInfo.value.push(
      Object.assign({
        name: key,
        value: res[key],
      })
    );
  }
};

const fileChartOption = reactive({
  title: {
    text: "文件类型占用空间百分比",
    left: "center",
  },
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

onMounted(() => {
  const userInfo = proxy.VueCookies.get("userInfo");
  console.log(userInfo);
  Object.assign(userInfoData, userInfo);
  getFileMemoryInfo();
});
</script>

<style lang="less" scoped>
.div-body {
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  flex: 1;
  height: 100%;
  padding: 15px;
  margin: 0;
  .div-header {
    display: inline-flex;
    justify-content: space-between;
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
      max-height: 350px;
      height: 200px;
    }
  }
  .div-footer {
    display: flex;
    flex: 2;
    margin: 10px;
    width: 100%;
  }
}
</style>
