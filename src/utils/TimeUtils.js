export default class TimeUtils {
  static getDaysInMonth(year, month) {
    // month 是 0-11 的范围，0 代表一月，11 代表十二月
    return new Date(year, month + 1, 0).getDate();
  }

  static getCurrentMonth(year, month) {
    let currentDate
    if (year) {
      currentDate = new Date(year, month, 0)
    } else {
      currentDate = new Date()
    }
    return currentDate.getMonth(); // 返回 0-11 的值
  }

  static getCurrentDay(year, month) {
    let currentDate
    if (year) {
      currentDate = new Date(year, month, 0)
    } else {
      currentDate = new Date()
    }
    return currentDate.getDay(); // 返回 0-6 的值，0 代表星期天，6 代表星期六
  }

  static getCurrentYear() {
    const currentDate = new Date();
    return currentDate.getFullYear();
  }

  static formatTime(time, fmt) {
    if (!time) return ''
    else {
      const date = new Date(time)
      const o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'H+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds(),
        'q+': Math.floor((date.getMonth() + 3) / 3),
        S: date.getMilliseconds()
      }
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
      for (const k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
          fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
        }
      }
      return fmt
    }
  }

}
