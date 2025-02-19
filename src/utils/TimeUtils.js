export default class TimeUtils {
  static getDaysInMonth(year, month) {
    // month 是 0-11 的范围，0 代表一月，11 代表十二月
    return new Date(year, month + 1, 0).getDate();
  }

  static getCurrentMonth(year, month) {
    let currentDate
    if (year) {
      currentDate = new Date(year, month + 1, 0)
    } else {
      currentDate = new Date()
    }
    return currentDate.getMonth(); // 返回 0-11 的值
  }

  static getCurrentDay(year, month) {
    let currentDate
    if (year) {
      currentDate = new Date(year, month + 1, 0)
    } else {
      currentDate = new Date()
    }
    return currentDate.getDay(); // 返回 0-6 的值，0 代表星期天，6 代表星期六
  }
}
