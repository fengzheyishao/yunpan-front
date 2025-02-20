export default class Util {
  static getObjType(obj) {
    const toString = Object.prototype.toString
    const map = {
      '[object Boolean]': 'boolean',
      '[object Number]': 'number',
      '[object String]': 'string',
      '[object Function]': 'function',
      '[object Array]': 'array',
      '[object Date]': 'date',
      '[object RegExp]': 'regExp',
      '[object Undefined]': 'undefined',
      '[object Null]': 'null',
      '[object Object]': 'object'
    }
    if (obj instanceof Element) {
      return 'element'
    }
    return map[toString.call(obj)]
  }

  static getAssetsFile = (url) => {
    const modules = import.meta.globEager('/src/assets/img/**/*.{png,svg,jpg,jpeg}')
    return modules[`/src/assets/img${url}`].default
  }

  static deepClone(data) {
    const type = this.getObjType(data)
    let obj
    if (type === 'array') {
      obj = []
    } else if (type === 'object') {
      obj = {}
    } else {
      return obj
    }
    if (type === 'array') {
      for (let i = 0; i < data.length; i++) {
        obj.push(this.deepClone(data[i]))
      }
    } else if (type === 'object') {
      for (const key of data) {
        obj[key] = this.deepClone(data[key])
      }
    }
    return obj
  }
}