<template>
  <div>
    <div class="top">
      <div class="upload-class">
        <el-upload
          :multpie="true"
          :with-credentials="true"
          :show-file-list="false"
          :http-request="addFile"
          :accept="fileAccept"
        >
          <el-button type="primary" class="btn">
            <el-icon class="iconfont">
              <DocumentAdd />
            </el-icon>
            <span>上传</span>
          </el-button>
        </el-upload>
      </div>
      <el-button type="success" class="btn"  @click="newFolder">
        <el-icon class="iconfont">
          <FolderAdd />
        </el-icon>
        <span>新建文件夹</span>
      </el-button>
      <el-button type="danger" class="btn" @click="delFileBatch" :disabled="selectFileIdList.length == 0">
        <el-icon class="iconfont">
          <FolderDelete />
        </el-icon>
        <span>批量删除</span>
      </el-button>
      <el-button type="warning" class="btn" @click="moveFolderBatch" :disabled="selectFileIdList.length == 0">
        <el-icon class="iconfont">
          <Rank />
        </el-icon>
        <span>批量移动</span>
      </el-button>
      <div class="search-panel">
        <span></span>
        <div class="reflushAndInput-class">
          <span style="padding-right: 10px">
            <el-icon size="large" @click="loadDataList" title="刷新">
              <Refresh />
            </el-icon>
          </span>
          <el-input
            clearable
            placeholder="输入文件名搜索"
            v-model="fileNameFuzzy"
            @keyup.enter="handleSearch"
          >
            <template #suffix>
              <el-icon @click="handleSearch" title="搜索">
                <Search />
              </el-icon>
            </template>
          </el-input>
        </div>
      </div>
    </div>
    <div class="nav-class">
      <Navigation ref="navigationRef" @navChange="navChange"></Navigation>
    </div>
    <div class="mainShow-class">
      <div
        class="showTable-class"
        v-if="(tableData.list && tableData.list.length > 0)"
        ref="showTable"
      >
        <Table
          :colLabel="colLabel"
          :showPagination="true"
          :options="tableOptions"
          :dataSource="tableData"
          :fetch="loadDataList"
          :initFetch="false"
          @rowSelected="rowSelected"
        >
          <template #fileName="{ index, row }">
            <div
              class="file-item"
              @mouseenter="showOp(row)"
              @mouseleave="cancelShowOp(row)"
            >
              <template
                v-if="(row.fileType == 3 || row.fileType == 1) && row.status == 2"
              >
                <Icon :cover="row.fileCover" :width="32"></Icon>
              </template>
              <template v-else>
                <Icon
                  v-if="row.folderType == 0"
                  :fileType="row.fileType"
                ></Icon>
                <Icon v-if="row.folderType == 1" :fileType="0"></Icon>
              </template>
              <div class="file-name" v-if="!row.showEdit" :title="row.fileName">
                <span @click="preview(row)" class="span-fn" style="cursor: pointer;">{{ row.fileName }}</span>
                <span 
                  v-if="row.status == 0" 
                  class="transfer-status"
                  >转码中</span
                >
                <span
                  v-if="row.status == 1"
                  class="transfer-status transfer-fuai"
                  >转码失败</span
                >
              </div>
              <div class="edit-panel" v-if="row.showEdit">
                <el-input 
                    v-model.trim="row.fileNameReal"
                    ref="editNameRef"
                    :maxLength="190"
                    clearable
                    @keyup.enter="saveNameEdit(index)"
                >
                <template #suffix>{{ row.fileSuffix }}</template>
                </el-input>
                <el-button :disabled="row.fileNameReal?false:true" round @click="saveNameEdit(index)"><el-icon><Select /></el-icon></el-button>
                <el-button round @click="cancelNameEdit(index)"><el-icon ><CloseBold /></el-icon></el-button>
              </div>
              <div class="op" v-if="row.showFlag==undefined && (row.showOp && row.fileId&& row.status == 2)">
                  <span class="btn-span" @click="shareFile(row)">分享</span>
                  <span class="btn-span" v-if="row.folderType == 0" @click="download(row)">下载</span>
                  <span class="btn-span" @click="delFile(row)">删除</span>
                  <span class="btn-span" @click="editFileName(index, row)">重命名</span>
                  <span class="btn-span" @click="moveFile(row)">移动</span>
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
      <div class="mainNoShow-class" v-else>
        <div class="noShow-header-class">
          <h1>当前目录为空，上传你的第一个文件吧</h1>
        </div>
        <div class="noShow-boby-class">
          <div class="noShow-btn-class">
            <el-upload
              :show-file-list="false"
              :with-credentials="true"
              :multiple="true"
              :http-request="addFile"
              :accept="fileAccept"
            >
              <el-button type="primary">上传文件</el-button>
            </el-upload>
          </div>
          <div class="noShow-btn-class" v-if="category == 'all'">
            <el-button type="primary" @click="newFolder">新建文件夹</el-button>
          </div>
        </div>
      </div>
      <FolderSeletct ref="folderSeletctRef" @folderSelect="moveFolderDone"></FolderSeletct>
      <Preview ref="previewRef"></Preview>
      <ShareFile ref="sharefileRef"></ShareFile>
    </div>
  </div>
</template>

<script setup>
import Table from "@/components/Table.vue";
import ShareFile from "./ShareFile.vue";

import { ref, getCurrentInstance, computed, nextTick, onMounted } from "vue";
import CategoryInfo from "@/js/CategoryInfo.js";
import { useAllDateStores } from "@/stores";
import Icon from "@/components/Icon.vue";
import { ElMessageBox } from 'element-plus'

const store = useAllDateStores();

const { proxy } = getCurrentInstance();


const colLabel = [
  {
    prop: "fileName",
    label: "文件名",
    scopedSlots: "fileName",
  },
  {
    prop: "lastUpdateTime",
    label: "修改日期",
    width: 180,
  },
  {
    label: "大小",
    prop: "fileSize",
    scopedSlots: "fileSize",
    width: 180,
  },
];

const tableData = ref({});
const tableOptions = ref({
  extHeight: 50,
  selectType: "checkbox",
});
const category = ref("all");
const currentFolder = ref({ fileId: 0 });

const showLoad = ref(true);

const fileNameFuzzy = ref();

const loadDataList = async () => {
  let params = {
    category: category.value,
    filePid: currentFolder.value.fileId,
    pageNo: tableData.value.pageNo,
    pageSize: tableData.value.pageSize,
    fileNameFuzzy: fileNameFuzzy.value,
  };
  if (params.category !== "all") delete params.filePid;
  let res = await proxy.$api.getDataList(params, showLoad);
  if (!res) return;
  tableData.value = res;
  editing.value = false;
//   console.log(tableData)
};

const fileAccept = computed(() => {
  const categoryItem = CategoryInfo[category.value];
  return categoryItem ? categoryItem : "*";
});

const addFile = async (fileDate) => {
  store.state.showUploaderPlanel = true;
  let res = await store.addFile(fileDate.file, currentFolder.value.fileId);
  loadDataList();
};

const handleSearch = () => {
  showLoad.value = true;
  loadDataList();
};

const navigationRef = ref();

const showOp = (row)=>{
    tableData.value.list.forEach(element => {
      element.showOp = false;
    });
    row.showOp = true;
    // console.log(row.showOp);
}

const cancelShowOp = (row)=>{
    row.showOp = false;
}

const selectFileIdList = ref([]);
const selectFileList = ref([]);

const rowSelected = (rows) =>{
  // console.log(rows)
  selectFileList.value = rows;
  selectFileIdList.value = [];
  rows.forEach((item)=>{
    selectFileIdList.value.push(item.fileId);
  });
};

const editNameRef = ref();
const editing = ref(false);

const newFolder = ()=>{
    if (editing.value) return;
    // console.log(tableData)
    tableData.value.list.forEach((element)=>{
        element.showEdit = false;
    });
    editing.value = true;
    tableData.value.list.unshift({
        showEdit: true,
        fileType: 0,
        fileId: "",
        filePid: currentFolder.value.fileId,
    });
    setTimeout(()=>{
        editNameRef.value.focus();
    },0)
    // nextTick(()=>{
    //     console.log(editNameRef)
    //     editNameRef.value.focus();
    // });
}

const cancelNameEdit = (index)=>{
    const fileData = tableData.value.list[index];
    if (fileData.fileId) {
        delete fileData.showFlag;
        fileData.showEdit = false;
    } else {
        tableData.value.list.splice(index, 1);
    }
    editing.value = false;
}

const saveNameEdit = async (index)=>{
    // console.log(tableData.value.list[index]);
    const { fileNameReal, filePid, fileId } = tableData.value.list[index];
    if (fileNameReal == '' || fileNameReal.indexOf("/")!=-1) {
        proxy.Message.warning("文件名不能为空且不能含有斜杠");
    }
    let params = {
        fileId,
        filePid: filePid,
        fileName: fileNameReal,
    }
    let res;
    if (fileId == ""){
        res = await proxy.$api.addNewFolder(params, ()=>{});
    } else {
        res = await proxy.$api.renameFile(params, ()=>{});
    }
    if (!res) {
        proxy.Message.error("失败，请重试");
        return;
    }
    proxy.Message.success("成功");
    tableData.value.list[index] = res;
    editing.value = false;
}

const editFileName = (index, row)=>{
  if (tableData.value.list[0].fileId == "") {
    tableData.value.list.splice(0, 1);
    index--;
  }
  tableData.value.list.forEach((element)=>{
    element.showEdit = false;
    delete element.showFlag
  })
  row.showFlag = true;
  let currentData = tableData.value.list[index];
  currentData.showEdit = true;
  if (currentData.folderType == 0) {
    currentData.fileNameReal = currentData.fileName.
    substring(0, currentData.fileName.indexOf('.'));
    currentData.fileSuffix = currentData.fileName.
    substring(currentData.fileName.indexOf('.'));
  } else {
    currentData.fileNameReal = currentData.fileName;
    currentData.fileSuffix = "";
  }
  editing.value = true;
  setTimeout(()=>
  editNameRef.value.focus(),0);
}

const delFile = (row)=>{
  ElMessageBox.confirm(`你确定要删除【${row.fileName}】吗？删除的文件可在10天内通过回收站还原`,
    '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info',
    }
  ).then(
    async ()=>{
      let params = {
        fileIds: row.fileId,
      };
      let res = await proxy.$api.deleteFile(params, ()=>{});
      proxy.Message.success(`删除【${row.fileName}】成功`);
      loadDataList();
    }
  ).catch();
}

const delFileBatch = ()=>{
  // console.log(selectFileIdList.value.join(","))
  if (selectFileIdList.value.length == 0) return;
  ElMessageBox.confirm(`你确定要删除这些文件吗？删除的文件可在10天内通过回收站还原`,
    '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info',
    }
  ).then(
    async ()=>{
      let params = {
        fileIds: selectFileIdList.value.join(','),
      };
      let res = await proxy.$api.deleteFile(params, ()=>{});
      proxy.Message.success("删除成功");
      loadDataList();
    }
  ).catch();
}

const folderSeletctRef = ref();
const currentMoveFile = ref({});
/*  ROW

fileCategory: 3
fileCover: "202408/5623775312EdtlH7U6b8_.jpg"
fileId: "EdtlH7U6b8"
fileName: "1.5931826550211568E9.jpg"
filePid: "0"
fileSize: 52834
fileType: 3
folderType: 0
lastUpdateTime: "2024-08-10 01:54:25"
recoveryTime: null
showOp: false
status: 2 */
const moveFile = (row) =>{
  currentMoveFile.value = row;
  folderSeletctRef.value.showFolderDialog();
}

const moveFolderDone = async (folderId)=>{
  if (currentMoveFile.value.filePid === folderId ||
    currentFolder.value.fileId == folderId
  ) {
    proxy.Message.warning("文件正在当前目录，无需移动");
    return;
  }
  let filedIdsArray = [];
  if (currentMoveFile.value.fileId) {
    filedIdsArray.push(currentMoveFile.value.fileId);
  } else {
    filedIdsArray = filedIdsArray.concat(selectFileIdList.value);
  }
  let params = {
    fileIds: filedIdsArray.join(","),
    filePid: folderId,
  }
  let res = await proxy.$api.changeFileFolder(params, ()=>{});
  // console.log(res);
  folderSeletctRef.value.close();
  loadDataList();
  proxy.Message.success("移动文件成功")
}

const previewRef = ref();

const preview = (row)=>{
  if (row.folderType == 1){
    navigationRef.value.openFolder(row);
    return;
  }
  if (row.status != 2) {
    proxy.Message.warning("文件正在转码中，无法预览");
    return;
  }
  store.state.showUploaderPlanel = false;
  previewRef.value.showPreview(row, 0);
}

const navChange = (data)=>{
  // console.log(data)
  const { curFolder, categoryId } = data;
  currentFolder.value = curFolder;
  showLoad.value = true;
  category.value = categoryId;
  loadDataList();
}

const moveFolderBatch = ()=>{
  currentMoveFile.value = {};
  const excludeFileIdList = [currentFolder.value.fileId];
  selectFileList.value.forEach((item)=>{
    if (item.folderType == 1) {
      excludeFileIdList.push(item.fileId);
    }
  })
  folderSeletctRef.value.showFolderDialog(excludeFileIdList.join(','));
}

const download = async (row) => {
  let res = await proxy.$api.createDownloadUrl(row.fileId);
  if (!res) {
    return;
  }
  
  window.location.href = `/api/file/download/` + res;
};

const sharefileRef = ref();

const shareFile = (row)=>{
  sharefileRef.value.show(row);
}


</script>

<style lang="less" scoped>

.top {
  display: flex;
  padding: 10px 20px;

  .upload-class {
    margin-right: 12px;
  }

  .btn {
    .iconfont {
    }

    span {
      margin-top: 3px;
    }
  }

  .search-panel {
    display: flex;
    width: 100%;
    justify-content: space-between;

    .reflushAndInput-class {
      display: flex;
      align-items: center;

      .el-input {
        width: 230px;
        margin-right: 50px;
      }

      span {
        cursor: pointer;
      }
    }
  }
}

.mainNoShow-class {
  flex-direction: column;
  height: 100vh;

  .showTable-class{
    display: flex;
  }

  .noShow-header-class {
    h1 {
      text-align: center;
      font-size: 30px;
      line-height: 100px;
      color: #db6262;
    }
  }

  .noShow-boby-class {
    margin: 100px;
    display: flex;
    justify-content: space-around;
    height: 70px;

    .noShow-btn-class {
    }
  }
}

.edit-panel{
    flex: 1;
    display: flex;
    padding: 0;
    margin: 0 5px;
    .el-input {
        width: 80%;
    }
    .el-button {
        margin-left: 5px;
        color: cornflowerblue;
    }
}

.mainShow-class{
  height: 100vh;
  overflow: hidden;
}

.showTable-class{
    padding:5px 15px 0 15px;
}

.file-item{
    display: flex;
    align-items: center;

    .file-name{
      display: flex;
      margin-left: 8px;
    }
    .op {
        margin-right: 10px;
        width: 90%;
        display: flex;
        justify-content: end;
        .btn-span{
          padding-left: 7px;
          cursor: pointer;
          transition: all 0.2s ease;

          &:hover{
            color: #db6262;
            font-size: large;
          }
        }
        &:hover .btn-span:not(:hover){
          color: #aaabbb;
          filter: grayscale(60%);
          font-size: small;
        }
    }
}

.span-fn{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 300px;
}

.nav-class{
  margin-left: 30px;
}
</style>
