import SparkMD5 from "spark-md5";
import api from "@/api/api";

const chunkSize = 1024 * 1024 * 3;

const STATUS = {
  emptyfile: {
    value: "emptyfile",
    desc: "文件为空",
    color: "#F75000",
    icon: "close",
  },
  fail: {
    value: "fail",
    desc: "上传失败",
    color: "#F75000",
    icon: "close",
  },
  init: {
    value: "init",
    desc: "解析中",
    color: "#e6a23c",
    icon: "clock",
  },
  uploading: {
    value: "uploading",
    desc: "上传中",
    color: "#409eff",
    icon: "upload",
  },
  upload_finish: {
    value: "upload_finish",
    desc: "上传完成",
    color: "#67c23a",
    icon: "ok",
  },
  upload_seconds: {
    value: "upload_seconds",
    desc: "秒传",
    color: "#67c23a",
    icon: "ok",
  },
};

export default {
  STATUS,
  chunkSize,
  async computeMD5(fileItem, state) {
    let file = fileItem.file;
    let blobSlice =
      File.prototype.slice ||
      File.prototype.mozSlice ||
      File.prototype.webkitSlice;
    let chunks = Math.ceil(file.size / chunkSize);
    let currentChunk = 0;
    let spark = new SparkMD5.ArrayBuffer();
    let fileReader = new FileReader();

    let loadNext = () => {
      let start = currentChunk * chunkSize;
      let end = start + chunkSize >= file.size ? file.size : start + chunkSize;
      fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
    };

    loadNext();
    return new Promise((resolve, reject) => {
      let resultFile = state.find((item) => {
        return item.file.uid === file.uid;
      });
      fileReader.onload = (e) => {
        spark.append(e.target.result);
        currentChunk++;
        if (currentChunk < chunks) {
          let percent = Math.floor((currentChunk / chunks) * 100);
          resultFile.md5Progress = percent;
          loadNext();
        } else {
          let md5 = spark.end();
          spark.destroy();
          resultFile.md5Progress = 100;
          resultFile.status = "uploading";
          resultFile.md5 = md5;
          resolve(fileItem.uid);
        }
      };
      fileReader.onerror = () => {
        resultFile.md5Progress = -1;
        resultFile.status = "fail";
        reject(fileItem.uid);
      };
    }).catch((error) => {
      console.log(error);
    });
  },

  async uploadFile(uid, state, chunkIndex) {
    
    chunkIndex = chunkIndex ? chunkIndex : 0;
    let currentFile = state.value.fileList.find((item) => {
      return item.file.uid === uid;
    });
    const file = currentFile.file;
    const fileSize = currentFile.totalSize;
    const chunks = Math.ceil(fileSize / chunkSize);
    for (let i = chunkIndex; i < chunks; i++) {
      currentFile = state.value.fileList.find((item) => {
        return item.file.uid === uid;
      });
      let delIndex = state.value.delList.indexOf(uid);
      if (delIndex != -1) {
        const res = await api.deleteUploadFile({ fileId: currentFile.fileId });
        if (!res) return;
        state.value.delList.splice(delIndex, 1);
        break;
      }
      if (currentFile.pause) {
        break;
      }
      if (currentFile.uploadStatus) return
      
      let start = i * chunkSize;
      let end = Math.min(fileSize, start + chunkSize);
      let chunkFile = file.slice(start, end);
      let params = {
        file: chunkFile,
        fileName: file.name,
        fileMd5: currentFile.md5,
        chunkIndex: i,
        chunks: chunks,
        fileId: currentFile.fileId,
        filePid: currentFile.filePid,
      };
      currentFile.uploadStatus = true;
      let res = await api.uploadFile(
        params,
        (event) => {
          let loaded = event.loaded;
          if (loaded > fileSize) {
            loaded = fileSize;
          }
          currentFile.uploadSize = i * chunkSize + loaded;
          currentFile.uploadProgress = Math.floor(
            (currentFile.uploadSize / fileSize) * 100
          );
        },
        (errorMsg) => {
          currentFile.status = STATUS.fail.value;
          currentFile.errorMsg = errorMsg;
        }
      );
      currentFile.uploadStatus = false;
      if (res == null) {
        currentFile.uploadSize = currentFile.totalSize;
        currentFile.uploadProgress = 100;
        break;
      }
      currentFile.fileId = res.fileId;
      currentFile.status = STATUS[res.status].value;
      currentFile.chunkIndex = i+1;
      if (
        res.status == STATUS.upload_seconds.value ||
        res.status == STATUS.upload_finish.value
      ) {
        currentFile.uploadSize = currentFile.totalSize;
        currentFile.uploadProgress = 100;
        break;
      }
    }
  },
};
