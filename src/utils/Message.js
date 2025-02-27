import { ElMessage, ElMessageBox } from "element-plus";

let messageDom = null;
const resetMessage = (options) => {
  if (messageDom) messageDom.close();
  messageDom = ElMessage(Object.assign(options, { offset: 20 }));
};

const resetMessageBox = (type, options) => {
  if (document.getElementsByClassName("el-overlay-message-box").length === 0) {
    ElMessageBox[type]("", "", options);
  }
};

const typeArr = ['info', 'alert', 'confirm']
typeArr.forEach((type) => {
  if (type === 'alert' || type === 'confirm') {
    resetMessage[type] = (options) => {
      return resetMessageBox(type, options)
    }
  } else {
    resetMessage[type] = (options) => {
      if (typeof options === 'string') options = { message: options }
      options.type = type
      return resetMessage(options)
    }
  }
})

const showMessage = (msg, callback, type) => {
  ElMessage({
    type: type,
    message: msg,
    duration: 2000,
    onClose: () => {
      if (callback) {
        callback();
      }
    },
  });
};

const NETWORK_ERROR = "网络错误";
const NETWORK_SUSS = "提交成功";
const NETWORK_WARNING = "警告";

const messageNETWORK = {
  error: (msg, callback) => {
    showMessage(msg, callback, "error");
  },
  success: (msg, callback) => {
    showMessage(msg, callback, "success");
  },
  warning: (msg, callback) => {
    showMessage(msg, callback, "warning");
  },
  ...resetMessage
};

export default messageNETWORK;
