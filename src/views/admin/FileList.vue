<template>
    <div>
    <div class="top">
      <el-button type="danger" class="btn" @click="delFileBatch" :disabled="selectFileIdList.length == 0">
        <el-icon class="iconfont">
          <FolderDelete />
        </el-icon>
        <span>批量删除</span>
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
      <Navigation ref="navigationRef" @navChange="navChange" :adminShow="true"></Navigation>
    </div>
    <div class="mainShow-class">
      <div
        class="showTable-class"
        ref="showTable"
      >
        <Table
          :colLabel="colLabel"
          :showPagination="true"
          :options="tableOptions"
          :dataSource="tableData"
          :fetch="loadDataList"
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
              <div class="op" v-if="(row.showOp && row.fileId&& row.status == 2)">
                  <span class="btn-span" v-if="row.folderType == 0" @click="download(row)">下载</span>
                  <span class="btn-span" @click="delFile(row)">删除</span>
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
    <Preview ref="previewRef"></Preview>
</div>
</template>

<script setup>
import Table from "@/components/Table.vue";
import { ref, getCurrentInstance, computed, nextTick, onMounted } from "vue";
import { useAllDateStores } from "@/stores";
import Icon from "@/components/Icon.vue";
import { ElMessageBox } from 'element-plus'

const { proxy } = getCurrentInstance();
const store = useAllDateStores();

const colLabel = [
  {
    label: "文件名",
    prop: "fileName",
    scopedSlots: "fileName",
  },
  {
    label: "发布人",
    prop: "nickName",
    width: 180,
  },
  {
    label: "修改时间",
    prop: "lastUpdateTime",
    width: 180,
  },
  {
    label: "大小",
    prop: "fileSize",
    scopedSlots: "fileSize",
    width: 150,
  },
];

const tableData = ref({});
const tableOptions = ref({
  extHeight: 40,
  selectType: "checkbox",
});

const currentFolder = ref({ fileId: 0 });

const loadDataList = async () => {
  let params = {
    filePid: currentFolder.value.fileId,
    pageNo: tableData.value.pageNo,
    pageSize: tableData.value.pageSize,
    fileNameFuzzy: fileNameFuzzy.value,
  };
  let res = await proxy.$api.adminloadFileList(params, showLoad);
  if (!res) return;
  tableData.value = res;
};

const showLoad = ref(true);
const fileNameFuzzy = ref();

const handleSearch = () => {
  showLoad.value = true;
  loadDataList();
};

const selectFileIdList = ref([]);

const rowSelected = (rows) =>{
  // console.log(rows)
  selectFileIdList.value = [];
  rows.forEach((item)=>{
    selectFileIdList.value.push(item.userId + "_" + item.fileId);
  });
};

const showOp = (row) => {
  tableData.value.list.forEach((element) => {
    element.showOp = false;
  });
  row.showOp = true;
};

const cancelShowOp = (row) => {
  row.showOp = false;
};

const navigationRef = ref();
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
  previewRef.value.showPreview(row, 1);
}

const navChange = (data) => {
  const { curFolder } = data;
  currentFolder.value = curFolder;
  showLoad.value = true;
  loadDataList();
};

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
        fileIdAndUserIds: row.userId + "_" + row.fileId,
      };
      let res = await proxy.$api.adminDeleteFile(params);
      proxy.Message.success(`删除【${row.fileName}】成功`);
      loadDataList();
    }
  ).catch();
}

const delFileBatch = ()=>{
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
        fileIdAndUserIds: selectFileIdList.value.join(','),
      };
      let res = await proxy.$api.adminDeleteFile(params);
      proxy.Message.success("删除成功");
      loadDataList();
    }
  ).catch();
}

const download = async (row) => {
  let res = await proxy.$api.adminCreateDownloadUrl(row.userId, row.fileId);
  if (!res) {
    return;
  }
  
  window.location.href = `/api/admin/download/` + res;
};

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
