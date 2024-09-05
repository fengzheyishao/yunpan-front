<template>
    <div>
      <div class="top">
        <el-button type="primary" class="btn"  @click="revertBatch" :disabled="selectIdList.length == 0">
          <el-icon class="iconfont">
            <RemoveFilled />
          </el-icon>
          <span>批量还原</span>
        </el-button>
        <el-button type="success" class="btn"  @click="delBatch" :disabled="selectIdList.length == 0">
          <el-icon class="iconfont">
            <RemoveFilled />
          </el-icon>
          <span>批量删除</span>
        </el-button>
      </div>
      <div class="showTable-class">
        <Table
          :colLabel="columns"
          :showPagination="true"
          :dataSource="tableData"
          :fetch="loadDataList"
          :options="tableOptions"
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
                  <span 
                  class="span-fn" style="cursor: pointer;">
                  {{ row.fileName }}
                  </span>
                </div>
                <div class="op" v-if="(row.showOp && row.fileId)">
                    <span class="btn-span" @click="revert(row)">还原</span>
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
  </template>
  
<script setup>
  import { ref, getCurrentInstance, onMounted, nextTick } from 'vue';
  import { ElMessageBox } from 'element-plus';
  import { useAllDateStores } from '@/stores';
  
  import useClipboard from "vue-clipboard3";
  const { toClipboard } = useClipboard();
  
  const tableData = ref({});
  
  const columns = [
  {
    label: "文件名",
    prop: "fileName",
    scopedSlots: "fileName",
  },
  {
    label: "删除时间",
    prop: "recoveryTime",
    width: 180,
  },
  {
    label: "大小",
    prop: "fileSize",
    scopedSlots: "fileSize",
    width: 100,
  },
];
  
  const tableOptions = ref({
    extHeight: 30,
    selectType: "checkbox",
  });
  
  const { proxy } = getCurrentInstance();
  
  /* list {
    code: "Xhkew"
    expireTime: null
    fileCategory: 3
    fileCover: "202408/3178033358QeK1dCKea5_.jpg"
    fileId: "BKFgV2JRPd"
    fileName: "u=2206588774,1931400306&fm=27&gp=0_fXlzl.jpg"
    fileType: 3
    folderType: 0
    shareId: "QGyynovd5BufDTVQvCHP"
    shareTime: "2024-08-18 19:11:37"
    showCount: 0
    userId: "3178033358"
    validType: 3}
  
  pageNo: 1
  pageSize: 15
  pageTotal: 1
  totalCount: 6
  */
  const loadDataList = async ()=> {
    let params = {
      pageNo: tableData.value.pageNo,
      pageSize: tableData.value.pageSize,
    }
    let res = await proxy.$api.loadRecycleList(params);
    if (!res) {
      return;
    }
    tableData.value = res;
    // console.log(res);
  }
  
  const showOp = (row)=>{
    tableData.value.list.forEach(element => {
      element.shopOp = false;
    });
    row.showOp = true;
  }
  
  const cancelShowOp = (row)=>{
    row.showOp = false;
  }
  
  const selectIdList = ref([]);

  const rowSelected = (rows)=>{
    selectIdList.value = [];
    rows.forEach((item) => {
      selectIdList.value.push(item.fileId);
    });
  }

  const revert = async (row)=>{
    ElMessageBox.confirm(`你确定要恢复【${row.fileName}】吗？`,
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
        let res = await proxy.$api.recoverRecycleFile(params);
        proxy.Message.success(`恢复【${row.fileName}】成功`);
        nextTick(()=>{
            loadDataList();
        })
      }
    ).catch();
  }
  
  const revertBatch = ()=>{
    if (selectIdList.value.length == 0) return;
    ElMessageBox.confirm(`你确定要恢复这些文件吗？`,
      '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info',
      }
    ).then(
      async ()=>{
        let params = {
            fileIds: selectIdList.value.join(',')
        };
        let res = await proxy.$api.recoverRecycleFile(params);
        proxy.Message.success("恢复成功");
        loadDataList();
      }
    ).catch();
  }
  
  const store = useAllDateStores();

  const delFile = (row)=>{
    ElMessageBox.confirm(`你确定要彻底删除【${row.fileName}】吗？`,
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
        let res = await proxy.$api.delRecycleFile(params);
        proxy.Message.success(`彻底删除【${row.fileName}】成功`);
        nextTick(()=>{
            loadDataList();
            store.reloadSpacePercent();
        })
      }
    ).catch();
  }
  
  const delBatch = ()=>{
    if (selectIdList.value.length == 0) return;
    ElMessageBox.confirm(`你确定要彻底删除这些文件吗？`,
      '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info',
      }
    ).then(
      async ()=>{
        let params = {
            fileIds: selectIdList.value.join(',')
        };
        let res = await proxy.$api.delRecycleFile(params);
        proxy.Message.success("彻底删除成功");
        nextTick(()=>{
            loadDataList();
            store.reloadSpacePercent();
        })
      }
    ).catch();
  }
  
  </script>
  
  <style lang="less" scoped>
  .top {
    display: flex;
    padding: 10px 20px;
    .btn {
      .iconfont {
      }
  
      span {
        margin-top: 3px;
      }
    }
  }
  
  .showTable-class{
    padding:5px 15px 0 15px;
    width: 100%;
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
            padding-left: 15px;
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
  }
  
  .span-fn{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 300px;
  }
  
  </style>