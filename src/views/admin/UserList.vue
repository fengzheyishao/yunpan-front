<template>
  <div>
      <div class="top">
        <el-form :model="searchFormData" label-width="80px" @submit.prevent>
        <el-row>
          <el-col :span="6">
            <!--input输入-->
            <el-form-item label="用户昵称">
              <el-input
                clearable
                placeholder="支持模糊搜索"
                v-model.trim="searchFormData.nickNameFuzzy"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <!-- 下拉框 -->
            <el-form-item label="状态">
              <el-select
                clearable
                placeholder="请选择状态"
                v-model="searchFormData.status"
              >
                <el-option :value="1" label="启用"></el-option>
                <el-option :value="0" label="禁用"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5" :style="{ 'padding-left': '10px' }">
            <el-button type="primary" @click="loadDataList"> 查询 </el-button>
          </el-col>
        </el-row>
      </el-form>
      </div>
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
        <template #avatar="{ index, row }">
            <el-avatar :size="35" :src="`/api/getAvatar/${row.userId}`"/>
        </template>
        <template #space="{ index, row }">
          {{ proxy.Utils.size2Str(row.useSpace) }}/{{
            proxy.Utils.size2Str(row.totalSpace)
          }}
        </template>
        <template #status="{ index, row }">
          <span v-if="row.status == 1" style="color: #529b2e">启用</span>
          <span v-if="row.status == 0" style="color: #f56c6c">禁用</span>
        </template>
        <template #op="{ index, row }">
          <span class="a-link" @click="updateSpace(row)" style="cursor: pointer;">分配空间</span>
          <el-divider direction="vertical" />
          <span class="a-link" @click="updateUserStatus(row)" style="cursor: pointer;">{{
            row.status == 0 ? "启用" : "禁用"
          }}</span>
        </template>
        </Table>
    </div>
  </div>
  <Dialog
    :show="dialogConfig.show"
    :title="dialogConfig.title"
    :buttons="dialogConfig.buttons"
    width="450px"
    :showCancel="true"
    @close="dialogConfig.show = false"
    >
      <el-form
        :model="formData"
        :rules="rules"
        ref="formDataRef"
        label-width="80px"
        @submit.prevent
      >
        <!--input输入-->
        <el-form-item label="昵称">
          {{ formData.nickName }}
        </el-form-item>
        <el-form-item label="空间大小" prop="changeSpace">
          <el-input
            clearable
            placeholder="请输入空间大小"
            v-model="formData.changeSpace"
          >
            <template #suffix>MB</template>
          </el-input>
        </el-form-item>
      </el-form>
  </Dialog>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted, nextTick } from 'vue';
import { ElMessageBox } from 'element-plus'
import { useAllDateStores } from "@/stores";
import Dialog from '@/components/Dialog.vue';

const { proxy } = getCurrentInstance();
const store = useAllDateStores();

const colLabel = [
  {
    label: "头像",
    prop: "avatar",
    width: 80,
    scopedSlots: "avatar",
  },
  {
    label: "昵称",
    prop: "nickName",
  },
  {
    label: "邮箱",
    prop: "email",
  },
  {
    label: "空间使用",
    prop: "space",
    scopedSlots: "space",
  },
  {
    label: "加入时间",
    prop: "joinTime",
  },
  {
    label: "最后登录时间",
    prop: "lastLoginTime",
  },
  {
    label: "状态",
    prop: "status",
    scopedSlots: "status",
    width: 80,
  },
  {
    label: "操作",
    prop: "op",
    width: 150,
    scopedSlots: "op",
  },
];

const tableOptions = {
  extHeight: 30,
};

const dialogConfig = ref({
  show: false,
  title: "修改空间大小",
  buttons: [
    {
      type: "primary",
      text: "确定",
      click: (e) => {
        submitForm();
      },
    },
  ],
});

const rules = {
  changeSpace: [{ required: true, message: "请输入空间大小" }],
};

const tableData = ref({});

const searchFormData = ref({});

const loadDataList = async () => {
  let params = {
    pageNo: tableData.value.pageNo,
    pageSize: tableData.value.pageSize,
  };
  Object.assign(params, searchFormData.value)
  let res = await proxy.$api.loadUserList(params);
  if (!res) return;
  tableData.value = res;
//   console.log(res);
};

const getIconImg = (row)=>{
  return new URL(`/api/getAvatar/${row.userId}`, import.meta.url).href
}

const formDataRef = ref();

const updateSpace = (row)=>{
    dialogConfig.value.show = true;
    nextTick(()=>{
        formDataRef.value.resetFields();
        formData.value = Object.assign({}, row);
    })
}

const formData = ref({});

const submitForm = ()=>{
  formDataRef.value.validate(async (valid) => {
    if (!valid) return;
    let params = {
        userId: formData.value.userId,
        changeSpace: formData.value.changeSpace,
    }
    let res = await proxy.$api.updateUserSpace(params);
    dialogConfig.value.show = false;
    proxy.Message.success("操作成功");
    loadDataList();
  });
}

const updateUserStatus = (row)=>{
    ElMessageBox.confirm(`你确定要${row.status == 0 ? "启动" : "禁用"}【${row.nickName}】的空间吗？`,
    '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info',
    }
  ).then(
    async ()=>{
      let params = {
        userId: row.userId,
        status: row.status == 0 ? 1 : 0,
      };
      let res = await proxy.$api.updateUserStatus(params, ()=>{});
      proxy.Message.success(`${row.status == 0 ? "启动" : "禁用"}【${row.nickName}】的空间成功`);
      loadDataList();
    }
  ).catch();
}

</script>

<style lang="less" scoped>
.top {
  padding: 10px 20px;
  max-height: 55px;
  .el-row{

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