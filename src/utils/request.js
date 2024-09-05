import axios from 'axios'
import config from '@/config/index'
import Message from '@/utils/Message'
import { ElLoading } from 'element-plus'

import { useRouter } from 'vue-router'

const contentTypeForm = 'application/x-www-form-urlencoded;charset=UTF-8'
const contentTypeJson = 'application/json'
const responseTypeJson = "json"

const service = axios.create({
    baseURL: config.baseURL,
    time: 30* 1000,
})

let loading = null;

const router = useRouter();

service.interceptors.request.use(
    (config)=>{
        // console.log(config);
        if (config.showLoading) {
            loading = ElLoading.service({
                lock: true,
                text: '加载中...',
                background: 'rgba(0, 0, 0, 0.8)'
            });
        }
        return config;
    },
    (error)=>{
        if (config.showLoading && loading) {
            loading.close();
        }
        Message.error("网络错误，请重试");
        return Promise.reject(error);
    }
)

service.interceptors.response.use(
    (response)=>{
        // console.log(response);
        const { showLoading, errorCallback, showError = true, responseType } = response.config;
        if (showLoading && loading) {
            loading.close();
        }
        const {code, data, info} = response.data;
        if (responseType == "arraybuffer" || responseType == "blob") {
            return response.data;
        }

        if (code === 200) {
            return data;
        } else if (code === 901) {
            // router.push("/login?redirectUrl=" + encodeURI(router.currentRoute.value.path));
            return Promise.reject({ showError: false, msg: "登录超时" });
        } else {
            if (errorCallback) {
                errorCallback(info);
            }
            return Promise.reject({showError: showError, msg: info});
        }
    },
    (error)=>{
        if (error.config.showLoading && loading) {
            loading.close();
        }
        return Promise.reject({ showError: true, msg: "网络异常" });
    }
);

const request = (config)=>{
    // console.log(config);
    const { url, params, dataType, showLoading = true, responseType = responseTypeJson } = config;
    let contentType = contentTypeForm;
    let formData = new FormData();
    for (let key in params) {
        formData.append(key, params[key] == undefined ? "" : params[key]);
    }
    if (dataType != null && dataType == 'json') {
        contentType = contentTypeJson;
    }
    let headers = {
        'Content-Type': contentType,
        'X-Requested-With': 'XMLHttpRequest',
    }

    return service.post(url, formData, {
        onUploadProgress: (event) => {
            if (config.uploadProgressCallback) {
                config.uploadProgressCallback(event);
            }
        },
        responseType: responseType,
        headers: headers,
        showLoading: showLoading,
        errorCallback: config.errorCallback,
        showError: config.showError
    }).then((res)=>{return res;}).catch(error=>{
        console.log(error);
        if (error.showError) {
            Message.error(error.msg);
        }
        return null;
    });
};

export default request;
