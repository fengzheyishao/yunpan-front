import { ElMessage } from "element-plus";

const showMessage = (msg, callback, type) => {
    ElMessage({
        type: type,
        message: msg,
        duration: 2000,
        onClose: () => {
            if (callback) {
                callback();
            }
        }
    })
}

const NETWORK_ERROR = '网络错误'
const NETWORK_SUSS = '提交成功'
const NETWORK_WARNING = '警告'

const messageNETWORK = {
    error: (msg, callback) =>{
        showMessage(msg, callback, "error");
    },
    success: (msg, callback) =>{
        showMessage(msg, callback, "success");
    },
    warning: (msg, callback) =>{
        showMessage(msg, callback, "warning");
    },
}

export default messageNETWORK;