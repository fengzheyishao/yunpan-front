<template>
  <div class="div-body">
    <div class="calendar">
      <div class="header">
        <span class="month">{{ dateData.year }}</span>
        <div style="align-items: center">
          <el-icon style="top: 2px; right: 5px; cursor: pointer" @click="clickHandle(-1)">
            <ArrowLeft />
          </el-icon>
          <span style="color: darkkhaki; font-size: 1.2em">{{
            dateData.month + 1
          }}</span>
          <el-icon style="top: 2px; left: 5px; cursor: pointer" @click="clickHandle(1)">
            <ArrowRight />
          </el-icon>
        </div>
      </div>
      <div class="week">Mon</div>
      <div class="week">Tue</div>
      <div class="week">Wed</div>
      <div class="week">Thu</div>
      <div class="week">Fri</div>
      <div class="week">Sat</div>
      <div class="week">Sun</div>
      <template v-for="index in day">
        <div :class="{ day: true, empty: true }"></div>
      </template>
      <template v-for="index in monthDay" :key="index">
        <div :class="{ day: true, 'day-point': dateData.data[index] !== 0 }"
          :style="{ backgroundColor: getColor(dateData.data[index]) }"
          :title="dateData.data[index] !== 0 ? dateData.data[index] : null">
          {{ index }}
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="js" setup>
import { ref, reactive, computed, onMounted, getCurrentInstance, nextTick } from 'vue'
import TimeUtils from '@/utils/TimeUtils.js'

const { proxy } = getCurrentInstance()

const gradientColors = [
  'rgba(255, 255, 255, 0.8)', // 白色
  'rgba(255, 204, 204, 0.8)', // 浅红色
  'rgba(255, 153, 153, 0.8)', // 中红色
  'rgba(255, 102, 102, 0.8)', // 深红色
  'rgba(255, 0, 0, 0.6)'      // 红色
];

const dateData = reactive({
  month: 0,
  day: 0,
  year: 0,
  data: new Array(32).fill(0)
})

const monthDay = computed(() => {
  if (dateData.month >= 0 && dateData.month <= 11) {
    return TimeUtils.getDaysInMonth(dateData.year, dateData.month);
  }
  return 0;
})

const day = computed(() => {
  if (dateData.month >= 0 && dateData.month <= 11) {
    return TimeUtils.getCurrentDay(dateData.year, dateData.month);
  }
  return 0;
})

const getColor = (count) => {
  if (count < 1) return gradientColors[0];
  if (count < 3) return gradientColors[1];
  if (count < 5) return gradientColors[2];
  if (count < 7) return gradientColors[3];
  return gradientColors[4];
}

const clickHandle = (x) => {
  let month = dateData.month + x
  let year = dateData.year

  // 检查月份是否超出范围
  if (month < 0) {
    year -= 1
    month = 11 // 设置为12月
  } else if (month > 11) {
    year += 1
    month = 0 // 设置为1月
  }

  const date = new Date(year, month)
  const curDate = new Date()
  if (date > curDate) {
    proxy.Message.error('不能再前进')
    return
  }

  nextTick(() => {
    dateData.month = month
    dateData.year = year
    getDate()
  })

}

const getDate = async () => {
  const loginDateStart = new Date(dateData.year, dateData.month, 1); // 当前月份第一天
  const loginDateEnd = new Date(dateData.year, dateData.month + 1, 1); // 下个月第一天
  const parmas = {
    loginDateStart: loginDateStart.toISOString().split('T')[0],
    loginDateEnd: loginDateEnd.toISOString().split('T')[0],
  }
  const res = await proxy.$api.getUserLoginInfoByUserIdAndTime(parmas)
  if (!res) return
  dateData.data.fill(0)
  res.map((item) => {
    const date = new Date(item.loginDate); // 将字符串转换为日期对象
    const day = parseInt(date.getDate()); // 获取日期
    dateData.data[day] = item.loginCount
  })
}

onMounted(() => {
  dateData.month = TimeUtils.getCurrentMonth()
  dateData.day = TimeUtils.getCurrentDay()
  dateData.year = TimeUtils.getCurrentYear()
  getDate()
})
</script>

<style lang="less" scoped>
.div-body {
  display: flex;
  max-width: 260px;
  background-color: antiquewhite;
  border-radius: 10px;
  padding: 10px 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  user-select: none;

  .calendar {
    display: inline-grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    gap: 6px;
    max-width: 300px;
    // margin: 0 auto;
    font-family: Arial, sans-serif;
  }

  .day {
    box-sizing: border-box;
    line-height: 27px;
    height: 28px;
    width: 28px;
    text-align: center;
    border-radius: 50%;
    border: 1px solid #ccc;
    background-color: #f9f9f9;
    font-size: small;
  }

  .week {
    text-align: center;
    background-color: transparent;
    border: none;
    font-size: small;
    font-family: "Times New Roman", Times, serif;
    font-weight: 200;
  }

  .day.empty {
    background-color: transparent;
    border: none;
  }

  .header {
    grid-column: span 7;
    display: inline-flex;
    justify-content: space-around;
    align-items: center;
    line-height: 1.8em;
    text-align: center;
    border-bottom: 1px solid #ccc;

    .month {
      font-size: 1.5em;
    }
  }

}

.day-point {
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.4);
  }
}
</style>
