<template>
  <div class="others">
    <div class="file-name">
        {{ fileInfo.fileName }}
    </div>
    <div class="tips">该类型的文件暂不支持预览，请下载后查看</div>
    <div class="download-btn">
        <el-button type="primary" @click="downLoad"
          >点击下载 {{ proxy.Utils.size2Str(fileInfo.fileSize) }}</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue';

const props = defineProps({
  createDownloadUrl: {
    type: String,
  },
  downloadUrl: {
    type: String,
  },
  fileInfo: {
    type: Object,
  },
});

const { proxy } = getCurrentInstance();

const downLoad = async ()=>{
    let res = await proxy.$api.getRequest(props.createDownloadUrl);
    if (!res) return;
    window.location.href = props.downloadUrl + "/" + res;
}


</script>

<style lang="less" scoped>
.others {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    padding: 10px 20px;
    .file-name {
        text-align: center;
        font-weight: bolder;
        margin-bottom: 15px;
    }
    .tips {
        margin-bottom: 15px;
        color: #999898;
        font-size: 13px;
    }
}
</style>