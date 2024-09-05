import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import UploadMethod from '@/utils/UploadMethod'
import api from '@/api/api'

function initState() {
  return {
    avatar: '',
    showUploaderPlanel: false,
    fileList: [],
    delList: [],
    spacePercent: { useSpace: 0, totalSpace: 1 },
  }
}

export const useAllDateStores = defineStore('allData', () => {
  
  const state = ref(initState());

  function clean(){
    state.value = initState();
    localStorage.removeItem("store");
  }

  async function addFile(file, filePid) {
    const fileItem = {
      file: file,
      //文件UID
      uid: file.uid,
      //md5进度
      md5Progress: 0,
      //md5值
      md5: null,
      //文件名
      fileName: file.name,
      //上传状态
      status: "init",
      //已上传大小
      uploadSize: 0,
      //文件总大小
      totalSize: file.size,
      //进度
      uploadProgress: 0,
      //暂停
      pause: false,
      //当前分片
      chunkIndex: 0,
      //父级ID
      filePid: filePid,
      //错误信息
      errorMsg: null,
    }
    state.value.fileList.unshift(fileItem);
    if (fileItem.totalSize == 0) {
      fileItem.status = "emptyfile";
      return;
    }
    let md5FileUid = await UploadMethod.computeMD5(fileItem, state.value.fileList);
    if (md5FileUid == null) {
      return;
    }
    
    await UploadMethod.uploadFile(md5FileUid, state);
    await reloadSpacePercent();
  }

  async function reloadSpacePercent() {
    let res = await api.getUseSpace(()=>{});
    if (!res) return;
    state.value.spacePercent = res;
  }

  return { state, clean, addFile, reloadSpacePercent }
})
