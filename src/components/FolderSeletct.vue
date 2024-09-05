<template>
    <div>
        <Dialog
            :show="dialogConfig.show"
            :title="dialogConfig.title"
            :buttons="dialogConfig.buttons"
            width="600px"
            :showCancel="true"
            @close="close"
            >
            <div class="navigation-panel">
              <Navigation ref="navigationRef" @navChange="navChange"
              :watchPath="false">
              </Navigation>
            </div>
            <div class="folder-list" v-if="folderList.length > 0">
                <div class="folder-item"
                    v-for="item,index in folderList"
                    :key="index"
                    @click="handerSelectFolder(item)">
                    <Icon :fileType="0"></Icon>
                    <span class="file-name">{{ item.fileName }}</span>
                </div>
            </div>
            <div v-else class="tips">
              <span>
                移动到
                <span>{{ currentFolder.fileName }}</span>
                文件夹
              </span>
            </div>
        </Dialog>
    </div>
</template>

<script setup>
import { ref, getCurrentInstance, nextTick } from 'vue';
import Icon from './Icon.vue';
import Navigation from './Navigation.vue';

const {proxy} = getCurrentInstance();

const dialogConfig = ref({
  show: false,
  title: "移动到",
  buttons: [
    {
      type: "primary",
      click: () => {
        folderSelect();
      },
      text: "移动到此",
    },
  ],
});

const filePid = ref("0");
const currentFileIds = ref({});
const folderList = ref([]);
const currentFolder = ref({});

const navigationRef = ref();

const loadAllFolder = async ()=>{
    let params = {
        filePid: filePid.value,
        currentFileIds: currentFileIds.value,
    }
    let res = await proxy.$api.loadAllFolder(params,()=>{});
    folderList.value = res;
}

const showFolderDialog = (currentFolder) =>  {
  dialogConfig.value.show = true;
  currentFileIds.value = currentFolder;
  filePid.value = 0;
  nextTick(()=>{
    loadAllFolder();
  })
}

const close = ()=>{
  dialogConfig.value.show = false;
}

const emit = defineEmits(['folderSelect']);

const folderSelect = ()=> {
  emit('folderSelect', filePid.value);
}

defineExpose({
  showFolderDialog, close, 
});

const navChange = (data)=>{
  const { curFolder } = data;
  currentFolder.value = curFolder;
  filePid.value = curFolder.fileId;
  loadAllFolder();
}

const handerSelectFolder = (item)=>{
  navigationRef.value.openFolder(item);
}

</script>

<style lang="less" scoped>
.navigation-panel{
  padding-bottom: 10px;
}
.folder-list{
  overflow: auto;
  max-height: calc(100vh - 200px);
  min-height: 200px;
  line-height: 24px;
  .folder-item{
    &:nth-child(2n){
      background-color:rgba(247, 245, 237, 0.918);
    }
    margin-bottom: 5px;
    cursor: pointer;
    display: flex;
    align-items: center;
    height: 30px;

    .file-name{
      max-width: 400px;
      margin-left: 10px;
      font-size: 17px;
      word-break: break-all;
      white-space: nowrap;
    }
  }
}

.tips{
  display: flex;
  height: 200px;
  span{
    margin: auto;
    
    span{
      font-size: large;
      color:blue;
    }
  }
}
</style>