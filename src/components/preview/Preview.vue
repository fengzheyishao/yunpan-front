<template>
    <PreviewImage
        ref="imageViewerRef"
        :imageList="[imageUrl]"
        v-if="fileInfo.fileCategory == 3"
    >
    </PreviewImage>
    <Window v-else
        :show="windowShow"
        :width="fileInfo.fileCategory == 1 ? 1500 : 900"
        :title="fileInfo.fileName"
        :align="fileInfo.fileCategory == 1 ? 'center':'top'"
        @close="handleClose"
    >
        <PreviewVideo v-if="fileInfo.fileCategory == 1"
            :url="url" >
        </PreviewVideo>
        <PreviewPdf v-if="fileInfo.fileType == 4"
            :url="url">
        </PreviewPdf>
        <PreviewDoc v-if="fileInfo.fileType == 5"
            :url="url">
        </PreviewDoc>
        <PreviewExcel v-if="fileInfo.fileType == 6"
            :url="url">
        </PreviewExcel>
        <PreviewTxt v-if="fileInfo.fileType == 7 || fileInfo.fileType == 8"
            :url="url">
        </PreviewTxt>
        <PreviewMusic v-if="fileInfo.fileCategory == 2"
            :url="url"
            :fileName="fileInfo.fileName">
        </PreviewMusic>
        <PreviewDownload
            :createDownloadUrl="createDownloadUrl"
            :downloadUrl="downloadUrl"
            :fileInfo="fileInfo"
            v-if="fileInfo.fileCategory == 5 && fileInfo.fileType != 8"
    ></PreviewDownload>
    </Window>
</template>

<script setup>
import Window from '../Window.vue';
import { computed, nextTick, ref } from 'vue';
import PreviewMusic from './PreviewMusic.vue';
import PreviewVideo from './PreviewVideo.vue';
import PreviewImage from './PreviewImage.vue';
import PreviewDoc from './PreviewDoc.vue';
import PreviewExcel from './PreviewExcel.vue';
import PreviewPdf from './PreviewPdf.vue';
import PreviewTxt from './PreviewTxt.vue';
import PreviewDownload from './PreviewDownload.vue';

const fileInfo = ref({});

const FILE_URL_MAP = {
  0: {
    fileUrl: "/file/getFile",
    videoUrl: "/file/ts/getVideoInfo",
    createDownloadUrl: "/file/createDownloadUrl",
    downloadUrl: "/api/file/download",
  },
  1: {
    fileUrl: "/admin/getFile",
    videoUrl: "/admin/ts/getVideoInfo",
    createDownloadUrl: "/admin/createDownloadUrl",
    downloadUrl: "/api/admin/download",
  },
  2: {
    fileUrl: "/showShare/getFile",
    videoUrl: "/showShare/ts/getVideoInfo",
    createDownloadUrl: "/showShare/createDownloadUrl",
    downloadUrl: "/api/showShare/download",
  },
};

const imageUrl = computed(()=>{
    return `/api/file/getImage/`+fileInfo.value.fileCover.replaceAll("_.", ".");
})

const imageViewerRef = ref();

const windowShow = ref(false);

const url = ref(null);
const createDownloadUrl =ref(null);
const downloadUrl = ref(null);

const showPreview = (data, showPart) => {
    fileInfo.value = data;
    if (data.fileCategory == 3) {
        nextTick(()=>{
            imageViewerRef.value.show(0);
        });
    }
    else {
        windowShow.value = true;
        let _url = FILE_URL_MAP[showPart].fileUrl;
        if (data.fileCategory == 1) _url = FILE_URL_MAP[showPart].videoUrl;
        let _createDownloadUrl = FILE_URL_MAP[showPart].createDownloadUrl;
        let _downloadUrl = FILE_URL_MAP[showPart].downloadUrl;
        if (showPart == 0) {
            _url = _url + '/' + data.fileId;
            _createDownloadUrl = _createDownloadUrl + '/' + data.fileId;
        }
        else if (showPart == 1) {
            _url = _url + '/' + data.userId + '/' + data.fileId;
            _createDownloadUrl =
                _createDownloadUrl + "/" + data.userId + "/" + data.fileId;
        }
        else if (showPart == 2) {
            _url = _url + "/" + data.shareId + "/" + data.fileId;
            _createDownloadUrl =
                _createDownloadUrl + "/" + data.shareId + "/" + data.fileId;
        }
        url.value = _url;
        createDownloadUrl.value = _createDownloadUrl;
        downloadUrl.value = _downloadUrl;
    }
}

defineExpose({showPreview, });

const handleClose = ()=>{
    windowShow.value = false;
}

</script>

<style lang="less" scoped>

</style>