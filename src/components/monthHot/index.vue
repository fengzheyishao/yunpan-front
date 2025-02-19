<template>
  <div class="div-body">
    <div class="calendar">
      <div class="header">
        <span class="month">2025</span>
        <div>
          <!-- <el-button size="small">本月</el-button> -->
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
      <template v-for="index in monthDay">
        <div :class="{ day: true }">
          {{ index }}
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="js" setup>
import {ref, reactive, computed, onMounted} from 'vue'
import TimeUtils from '@/utils/TimeUtils.js'

const props = defineProps({
  size: {
    type: String,
    default: "80%"
  }
})

const btnOptions = ref({ 'width': props.size, 'height': props.size })

const dateData = reactive({
  month: 0,
  day: 0,
  data: []
})

const monthDay = computed(() => {
  if (dateData.month >= 0 && dateData.month <= 11) {
    return TimeUtils.getDaysInMonth(new Date().getFullYear(), dateData.month);
  }
  return 0;
})

const day = computed(() => {
  if (dateData.month >= 0 && dateData.month <= 11) {
    return TimeUtils.getCurrentDay(new Date().getFullYear(), dateData.month);
  }
  return 0;
})

onMounted(() => {
  dateData.month = TimeUtils.getCurrentMonth()
  dateData.day = TimeUtils.getCurrentDay()
  console.log(dateData,monthDay)
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
  .calendar {
    display: inline-grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    gap: 6px;
    max-width: 300px;
    // margin: 0 auto;
    font-family: Arial, sans-serif;
  }

  .day {
    user-select: none;
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
</style>
