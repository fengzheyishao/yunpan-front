<template>
    <div class="nav-body">
        <span class="back-class" @click="setCurrentFolder(folderList.length-2)" v-if="folderList.length > 0" >回到上一级</span>
        <span style="margin: 0 3px; font-size: 13px;">~</span>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item @click="setCurrentFolder(-1)" class="home-class">全部文件</el-breadcrumb-item>
            <el-breadcrumb-item v-for="(item, index) in folderList"
                :key="index">
                <span class="no-current" @click="setCurrentFolder(index)" v-if="index < folderList.length - 1">{{ item.fileName }}</span>
                <span class="current" title="当前文件夹" v-if="index == folderList.length - 1">{{ item.fileName }}</span>
            </el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>

<script setup>
import { ref, getCurrentInstance, watch } from 'vue';
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();

const { proxy } = getCurrentInstance();

const props = defineProps({
  watchPath: {
    type: Boolean, //是否监听路径变化
    default: true,
  },
  shareId: {
    type: String,
  },
  adminShow: {
    type: Boolean,
    default: false,
  },
});

const category = ref();
const folderList = ref([]);
const currentFolder = ref({ fileId: "0" });

const openFolder = (data)=>{
    const { fileId, fileName } = data;
    const folder = {
        fileName: fileName,
        fileId: fileId,
    }
    folderList.value.push(folder);
    currentFolder.value = folder;
    setPath();
}

const init = ()=>{
    folderList.value = [];
    currentFolder.value = { fileId: '0' };
    doCallBack();
}

defineExpose({ openFolder, init })

const setPath = ()=>{
    if (!props.watchPath) {
        doCallBack();
        return;
    }
    let pathArray = [];
    folderList.value.forEach((item)=>{
        pathArray.push(item.fileId);
    })
    router.push(
        {
            path: route.path,
            query:
            pathArray.length == 0
                ? ""
                : {
                    path: pathArray.join("/"),
                },
        },
    );
}

//获取文件夹id
const getNavigationFolder = async (path) => {
    let params = {
        path: path,
        shareId: props.shareId,
    }
    let res;
    if (props.adminShow) res = await proxy.$api.admingetFolderInfo(params);
    else res = await proxy.$api.getFolderInfo(params, ()=>{});
    if (!res) {
        // proxy.Message.error("获取目录失败");
        return;
    }
    // console.log(res)
    folderList.value = res;
};

const emit = defineEmits(["navChange"]);
const doCallBack = ()=>{
    emit("navChange", {
        categoryId: category.value,
        curFolder: currentFolder.value,
    });
};

const setCurrentFolder = (index)=>{
    if (index == -1) {
        currentFolder.value = { fileId: "0" };
        folderList.value = [];
    } else {
        currentFolder.value = folderList.value[index];
        folderList.value.splice(index + 1, folderList.value.length);
    }
    setPath();
}

watch(()=>route, 
    (newVal, oldVal)=>{
        if (!props.watchPath) {
            return;
        }
        // console.log(newVal.query.path);
        if (newVal.path.indexOf("/main") === -1 &&
            newVal.path.indexOf("/settings/fileList") === -1 &&
            newVal.path.indexOf("/share") === -1
        ) {
            return;
        }
        const path = newVal.query.path;
        const categoryId = newVal.params.category;
        category.value = categoryId;
        if (path == undefined) {
            init();
        } else {
            getNavigationFolder(path);
            let pathArray = path.split('/');
            currentFolder.value = {
                fileId: pathArray[pathArray.length-1],
            };
            doCallBack();
        }
    }, {immediate: true, deep: true});

</script>

<style lang="less" scoped>
.nav-body{
    display: flex;
    align-items: center;
    .el-breadcrumb{
        :deep(.el-breadcrumb__inner) {
            cursor: pointer;
        }
    }
}

.back-class{
    color: cornflowerblue;
    font-size: 15px;
    cursor: pointer;
}

.current{
    color: coral;
    font-size: 14px;
}
</style>