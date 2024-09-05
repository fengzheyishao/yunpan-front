<template>
    <div class="share">
        <div class="head">
            <span class="back-class" @click="jump">BACK</span>
        </div>
        <div class="body">
            <div class="load" v-if="Object.keys(shareInfo).length == 0">

            </div>
            <div class="info-body" v-else>
                <div class="info">
                    <div class="avatar">
                        <el-avatar :size="35" :src="getIconImg()"/>
                    </div>
                    <div class="file-info">
                        <div class="nick-name">{{ shareInfo.nickName }} </div>
                        <div class="timeandName">
                            <span class="file-name">分享文件：{{ shareInfo.fileName }}</span>
                            <span class="share-time">分享于： {{ shareInfo.shareTime }}</span>
                        </div>
                    </div>
                    <div class="btn">
                        <el-button v-if="shareInfo.currentUser" type="primary" size="small" @click="cancelShare">取消分享</el-button>
                    </div>
                </div>
                <div class="share-body">
                    <div class="nav">
                        <Navigation ref="navigationRef" @navChange="navChange" :shareId="shareId"></Navigation>
                    </div>
                    <div class="share-table">
                        <Table :colLabel="columns" :showPagination="true" :dataSource="tableData" :fetch="loadDataList"
                            :initFetch="false" :options="tableOptions" :showPageSize="false" @rowSelected="rowSelected">
                            <template #fileName="{ index, row }">
                                <div class="file-item" @mouseenter="showOp(row)" @mouseleave="cancelShowOp(row)">
                                    <template v-if="(row.fileType == 3 || row.fileType == 1) && row.status == 2">
                                        <Icon :cover="row.fileCover" :width="32"></Icon>
                                    </template>
                                    <template v-else>
                                        <Icon v-if="row.folderType == 0" :fileType="row.fileType"></Icon>
                                        <Icon v-if="row.folderType == 1" :fileType="0"></Icon>
                                    </template>
                                    <div class="file-name" v-if="!row.showEdit" :title="row.fileName">
                                        <span @click="preview(row)" class="span-fn" style="cursor: pointer;">
                                            {{ row.fileName }}
                                        </span>
                                    </div>
                                    <div class="op">
                                        <span class="btn-span" v-if="row.folderType == 0"
                                            @click="download(row.fileId)">下载</span>
                                        <span class="btn-span" v-if="!shareInfo.currentUser"
                                            @click="save2MyPanSingle(row)">
                                            保存到我的网盘
                                        </span>
                                    </div>
                                </div>
                            </template>
                            <template #fileSize="{ index, row }">
                                <span v-if="row.fileSize">
                                    {{ proxy.Utils.size2Str(row.fileSize) }}</span
                                >
                            </template>
                        </Table>
                    </div>
                </div>
            </div>

        </div>
    </div>
    <FolderSeletct ref="folderSelectRef" @folderSelect="save2MyPanDone"></FolderSeletct>
    <!--预览-->
    <Preview ref="previewRef"> </Preview>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue';
import { useRouter, useRoute } from "vue-router";
import { ElMessageBox } from 'element-plus';


const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();

const shareInfo = ref({});
const shareId = route.params.shareId;

const columns = [
    {
        label: "文件名",
        prop: "fileName",
        scopedSlots: "fileName",
    },
    {
        label: "修改时间",
        prop: "lastUpdateTime",
        align: "center",
        width: 180,
    },
    {
        label: "大小",
        prop: "fileSize",
        scopedSlots: "fileSize",
        align: "center",
        width: 180,
    },
];

const tableData = ref({});

const tableOptions = {
    extHeight: 60,
    selectType: "checkbox",
};

onMounted(() => {
    getShareInfo();
})

const getShareInfo = async () => {
    let params = {
        shareId,
    };
    let res = await proxy.$api.getShareLoginInfo(params);
    if (res == null) {
        router.push("/ShareCheck/" + shareId);
        return;
    }
    shareInfo.value = res;
}

const currentFolder = ref({ fileId: 0 });

const loadDataList = async () => {
    let params = {
        pageNo: tableData.value.pageNo,
        pageSize: tableData.value.pageSize,
        shareId: shareId,
        filePid: currentFolder.value.fileId,
    }
    let res = await proxy.$api.loadWebShareList(params);
    if (!res) return;
    tableData.value = res;
}

const showOp = (row) => {
  tableData.value.list.forEach((element) => {
    element.showOp = false;
  });
  row.showOp = true;
};

const cancelShowOp = (row) => {
  row.showOp = false;
};

const selectFileIdList = ref([]);
const rowSelected = (rows) => {
  selectFileIdList.value = [];
  rows.forEach((item) => {
    selectFileIdList.value.push(item.fileId);
  });
};

const folderSelectRef = ref();
const save2MyPanFileIdArray = [];

const save2Mypan = ()=>{
    if (selectFileIdList.value.length == 0) return;
    if (!proxy.VueCookies.get("userInfo")) {
        router.push("/login?redirectUrl=" + route.path);
        proxy.Message.warning("尚未登陆,请登录");
        return;
    }
    save2MyPanFileIdArray.values = selectFileIdList.value;
    folderSelectRef.value.showFolderDialog();
}

const save2MyPanSingle = (row) => {
    if (!proxy.VueCookies.get("userInfo")) {
        router.push("/login?redirectUrl=" + route.path);
        proxy.Message.warning("尚未登陆,请登录");
        return;
    }
    save2MyPanFileIdArray.values = [row.fileId];
    folderSelectRef.value.showFolderDialog();
};

const save2MyPanDone = async (folderId) => {
    let params = {
        shareId: shareId,
        shareFileIds: save2MyPanFileIdArray.values.join(","),
        myFolderId: folderId,
    };
    let res = await proxy.$api.shareSaveShare(params);
    loadDataList();
    proxy.Message.success("保存成功");
    folderSelectRef.value.close();
}

const navChange = (data) => {
  const { curFolder } = data;
  currentFolder.value = curFolder;
  loadDataList();
};

const previewRef = ref();
const navigationRef = ref();
const preview = (data) => {
  if (data.folderType == 1) {
    navigationRef.value.openFolder(data);
    return;
  }
  data.shareId = shareId;
  previewRef.value.showPreview(data, 2);
};

const download = async (fileId) => {
    let res = await proxy.$api.shareCreateDownloadUrl(shareId, fileId);
    if (!res) return;
    window.location.href = `/api/showShare/download/` + res;
}

const cancelShare = () => {
    ElMessageBox.confirm(`你确定要取消分享吗？`,
    '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info',
    }
  ).then(
    async ()=>{
      let params = {
        shareIds: shareId,
      };
      let res = await proxy.$api.shareCancelShare(params);
      proxy.Message.success(`取消共享成功`);
      router.push("/");
    }
  ).catch();
}

const jump = () => {
  router.push("/");
};

const getIconImg = ()=>{
    if (shareInfo.value.avatar) {
        return new URL(`${shareInfo.value.avatar}`, import.meta.url).href;
    }
    else {
        return new URL(proxy.$api.getAvatar(shareInfo.value.userId), import.meta.url).href;
    }
}

</script>

<style lang="less" scoped>
.share {
    background: linear-gradient(to right, rgb(247, 209, 215), rgb(191, 227, 241));
    overflow: hidden;
    .head {
        height: 5vh;
        background-color: beige;
        .back-class {
            cursor: pointer;
            height: 100%;
            margin-left: 16%;
            display: flex;
            align-items: center;
            font-size: 20px;
            font-weight: bold;
            color: cadetblue;
            max-width: 35px;
        }
    }
}

.body {
    margin: 0 auto;
    width: 70vw;
    background-color:azure;
    .info {
        padding: 4px;
        border-bottom: 1px solid;
        display: flex;
        width: 100%;
        .avatar {

        }
        .file-info {
            display: flex;
            padding: 0 10px;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            .nick-name {
                font-size: large;
            }
            .timeandName {
                display: flex;
                font-size: small;
                color: cornflowerblue;
                flex-direction: column;
                .file-name {
                    margin-bottom: 5px;
                }
            }
        }
        .btn {
            display: flex;
            align-items: center;
            padding: 0 20px;
        }
    }
    .share-body {
        padding: 8px 2px;
        .nav {
            padding: 2px 2px 6px 2px;
        }
        
    }

    .file-item {
            display: flex;
            align-items: center;

            .file-name{
            display: flex;
            margin-left: 10px;
            }
            .op {
                margin-right: 10px;
                width: 60%;
                display: flex;
                justify-content: end;
                .btn-span{
                padding-left: 7px;
                cursor: pointer;
                }
            }
        }

    .span-fn{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 200px;
        max-width: 280px;
        }
}
</style>