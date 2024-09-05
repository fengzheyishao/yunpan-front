<template>
  <div class="uploader-panel">
    <div class="uploader-title">
      <span>上传任务</span>
      <span class="tips">（仅展示本次上传任务）</span>
    </div>
    <div class="file-list">
      <div class="file-item" v-for="(item, index) in fileList" :key="index">
        <div class="up-pa-class">
          <div class="upload-panel">
            <div class="file-name">
              {{ item.fileName }}
            </div>
            <div class="progress">
              <el-progress 
                v-if="
                item.status == STATUS.uploading.value ||
                item.status == STATUS.upload_seconds.value ||
                item.status == STATUS.upload_finish.value
              "
              :percentage="item.uploadProgress">
              </el-progress>
            </div>
          </div>
          <div class="upload-status">
            <component class="icons" :style="{ color: STATUS[item.status].color }" :is="STATUS[item.status].icon">
            </component>
            <span>{{ item.status == 'fail' ? item.errorMessages : STATUS[item.status].desc }}</span>
            <span>{{ proxy.Utils.size2Str(item.uploadSize) }}/{{ proxy.Utils.size2Str(item.totalSize) }}</span>
          </div>
        </div>
        <div class="op">
          <el-progress type="circle" :width="50" :percentage="item.md5Progress"
            v-if="item.status == STATUS.init.value" />
          <div class="op-btn" v-if="item.status === STATUS.uploading.value">
            <el-icon v-if="item.pause" class="icon" title="上传" @click="startUpload(item.uid)">
              <VideoPlay />
            </el-icon>
            <el-icon class="icon" title="暂停" @click="pauseUpload(item.uid)">
              <VideoPause />
            </el-icon>
            <el-icon v-if="
                item.status != STATUS.init.value &&
                item.status != STATUS.upload_finish.value &&
                item.status != STATUS.upload_seconds.value
              " class="icon" title="删除" @click="delUpload(item.uid, index)">
              <CircleClose />
            </el-icon>
            <el-icon v-if="
                item.status == STATUS.upload_finish.value ||
                item.status == STATUS.upload_seconds.value
              " class="icon" title="清除" @click="delUpload(item.uid, index)">
              <CloseBold />
            </el-icon>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, getCurrentInstance } from 'vue';

import { useAllDateStores } from '@/stores';

const store = useAllDateStores();
const { proxy } = getCurrentInstance();

const STATUS = {
  emptyfile: {
    value: "emptyfile",
    desc: "文件为空",
    color: "#F75000",
    icon: "Notification",
  },
  fail: {
    value: "fail",
    desc: "上传失败",
    color: "#F75000",
    icon: "WarnTriangleFilled",
  },
  init: {
    value: "init",
    desc: "解析中",
    color: "#e6a23c",
    icon: "Clock",
  },
  uploading: {
    value: "uploading",
    desc: "上传中",
    color: "#409eff",
    icon: "Upload",
  },
  upload_finish: {
    value: "upload_finish",
    desc: "上传完成",
    color: "#67c23a",
    icon: "Check",
  },
  upload_seconds: {
    value: "upload_seconds",
    desc: "秒传",
    color: "#67c23a",
    icon: "Check",
  },
};

const fileList = computed(() => {
  // console.log(store.state.fileList)
  return store.state.fileList
});

const getFileByUid = (uid) => {
  let file = store.state.fileList.find((item) => {
    return item.file.uid === uid;
  });
  return file;
};

</script>

<style lang="less" scoped>
.uploader-title {
  padding: 0 10px;
  line-height: 40px;
  border-bottom: 1px solid rgba(88, 71, 71, 0.699);
}

.file-list {

  overflow: auto;
  padding: 8px 10px;
  min-height: calc(100vh / 2);
  max-height: calc(100vh - 120px);

  .upload-panel {
    .file-name {
      margin-left: 4px;
      align-items: center;
      font-size: 12px;
    }
  }

  .file-item {
    border-bottom: 1px solid rgba(118, 155, 223, 0.699);
    margin-bottom: 5px;
    display: flex;
  }

  .up-pa-class {
    flex: 1;
    width: 10px;
  }

  .upload-status {
    display: flex;
    align-items: center;

    .icons {
      width: 15px;
      height: 15px;
      margin-right: 3px;
    }

    span {
      margin-left: 4px;
      font-size: 11px;
    }
  }
}

.op {
  display: flex;
  justify-content: center;
  align-items: center;

  .op-btn {
    display: flex;

    .icon {
      width: 20px;
      height: 20px;
    }
  }
}
</style>