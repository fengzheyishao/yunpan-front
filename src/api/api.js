import request from "@/utils/request.js";

export default{
    getRegEmailCode(params, errorCallback){
        return request({
            url: "/sendEmailCode",
            params,
            errorCallback,
        })
    },
    registerEmailPas(params, errorCallback){
        return request({
            url: "/register",
            params,
            errorCallback,
        })
    },
    loginCheck(params, errorCallback){
        return request({
            url: "/login",
            params,
            errorCallback,
        })
    },
    getAvatar(userid, timestamp){
        return `/api/getAvatar/${userid}?${timestamp}`;
            
    },
    updateUserAvatar(params, errorCallback) {
        return request({
            url: "/updateUserAvatar",
            params,
            errorCallback,
        })
    },
    logout(errorCallback) {
        return request({
            url: "/logout",
            errorCallback
        })
    },
    getDataList(params, showLoading) {
        return request({
            url: "/file/loadDataList",
            params,
            showLoading,
        })
    },
    getCoverImg(cover) {
        return `/api/file/getImage/${cover}`;
    },
    addNewFolder(params, errorCallback) {
        return request({
            url: "/file/newFoloder",
            params,
            errorCallback
        });
    },
    renameFile(params, errorCallback) {
        return request({
            url: "/file/rename",
            params,
            errorCallback
        });
    },
    deleteFile(params, errorCallback) {
        return request({
            url: "/file/delFile",
            params,
            errorCallback
        });
    },
    uploadFile(params, uploadProgressCallback, errorCallback) {
        return request({
            url: "/file/uploadFile",
            showLoading: false,
            dataType: "file",
            showError: false,
            params,
            uploadProgressCallback,
            errorCallback,
        });
    },
    loadAllFolder(params, errorCallback) {
        return request({
            url: "/file/loadAllFolder",
            params,
            errorCallback,
        });
    },
    changeFileFolder(params, errorCallback) {
        return request({
            url: "/file/changeFileFolder",
            params,
            errorCallback,
        });
    },
    getFolderInfo(params, errorCallback) {
        return request({
            url: "/file/getFolderInfo",
            showLoading: false,
            params,
            errorCallback,
        });
    },
    getUseSpace(errorCallback){
        return request({
            url: "/getUseSpace",
            showLoading: false,
            errorCallback,
        });
    },
    getRequest(url, responseType) {
        return request({
            url,
            responseType,
        });
    },
    createDownloadUrl(fileId) {
        return request({
            url: `/file/createDownloadUrl/${fileId}`
        });
    },
    shareFile(params) {
        return request({
            url: "/share/shareFile",
            params,
        });
    },
    loadShareList(params) {
        return request({
            url: "/share/loadShareList",
            params,
        });
    },
    cancelShareFile(params) {
        return request({
            url: "/share/cancelShare",
            params,
        });
    },
    loadRecycleList(params) {
        return request({
            url: "/recycle/loadRecycleList",
            params,
        });
    },
    delRecycleFile(params) {
        return request({
            url: "/recycle/delFile",
            params,
        });
    },
    recoverRecycleFile(params) {
        return request({
            url: "/recycle/recoverFile",
            params,
        });
    },
    adminloadFileList(params, showLoading) {
        return request({
            url: "/admin/loadFileList",
            params,
            showLoading,
        });
    },
    adminDeleteFile(params) {
        return request({
            url: "/admin/delFile",
            params,
        });
    },
    adminCreateDownloadUrl(userId, fileId) {
        return request({
            url: `/admin/createDownloadUrl/${userId}/${fileId}`
        });
    },
    admingetFolderInfo(params) {
        return request({
            url: "/admin/getFolderInfo",
            params,
        });
    },
    loadUserList(params) {
        return request({
            url: "/admin/loadUserList",
            params,
        });
    },
    updateUserSpace(params) {
        return request({
            url: "/admin/updateUserSpace",
            params,
        });
    },
    updateUserStatus(params) {
        return request({
            url: "/admin/updateUserStatus",
            params,
        });
    },
    getSysSettings() {
        return request({
            url: "/admin/getSysSettings",
        });
    },
    saveSysSettings(params) {
        return request({
            url: "/admin/saveSysSettings",
            params,
        });
    },
    getShareInfo(params) {
        return request({
            url: "/showShare/getShareInfo",
            params,
        });
    },
    checkShareCode(params) {
        return request({
            url: "/showShare/checkShareCode",
            params,
        });
    },
    getShareLoginInfo(params) {
        return request({
            url: "/showShare/getShareLoginInfo",
            showLoading: false,
            params,
        });
    },
    loadWebShareList(params) {
        return request({
            url: "/showShare/loadFileList",
            showLoading: true,
            params,
        });
    },
    shareCreateDownloadUrl(shareId, fileId) {
        return request({
            url: `/showShare/createDownloadUrl/${shareId}/${fileId}`,
        });
    },
    shareCancelShare(params) {
        return request({
            url: "/share/cancelShare",
            params,
        });
    },
    shareSaveShare(params) {
        return request({
            url: "/showShare/saveShare",
            params,
        });
    },
}