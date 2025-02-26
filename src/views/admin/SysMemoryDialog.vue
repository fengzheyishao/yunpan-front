<template>
  <Dialog
    :show="dialogConfig.show"
    :title="dialogConfig.title"
    :showCancel="false"
    width="50%"
    @close="dialogConfig.show = false"
  >
    <div>
      <el-form
        :model="formData"
        ref="formDataRef"
        label-width="120px"
        :disabled="dialogConfig.type === 'read'"
      >
        <template v-if="dialogConfig.type !== 'edit2'">
          <el-form-item label="申请内存大小" prop="requestSize">
            <el-input
              clearable
              placeholder="空"
              v-model="formData.requestSize"
              disabled
            >
              <template #suffix>MB</template>
            </el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input
              type="textarea"
              clearable
              placeholder="用户无备注"
              disabled
              :autosize="{ minRows: 4 }"
            />
          </el-form-item>
        </template>
        <el-form-item
          label="申请状态"
          :disabled="dialogConfig.type === 'read'"
          prop="statusRequest"
          :rules="[
            {
              required: true,
              validator: (rule, value, callback) => {
                if (value === 0 || value === undefined || value === null) {
                  callback(new Error('请选择有效的审批结果'));
                } else {
                  callback();
                }
              },
              trigger: 'change',
            },
          ]"
        >
          <el-radio-group v-model="formData.statusRequest" aria-label="label position">
            <el-radio-button :value="1">批准</el-radio-button>
            <el-radio-button :value="2">拒绝</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审批时间" disabled>
          <el-input
            placeholder="系统自动生成"
            v-model="formData.approvalTime"
            disabled
          />
        </el-form-item>
        <el-form-item v-if="formData.statusRequest === 2" label="拒绝原因">
          <el-input
            type="textarea"
            clearable
            placeholder="无"
            v-model="formData.rejectionReason"
            :autosize="{ minRows: 4 }"
          />
        </el-form-item>
        <el-form-item
          v-if="dialogConfig.type !== 'read' && dialogConfig.init === 0"
        >
          <el-button @click="handleChange">{{
            dialogConfig.btnText
          }}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </Dialog>
</template>

<script setup>
import Util from "@/utils/Util";
import { ref, getCurrentInstance, nextTick, reactive } from "vue";

const { proxy } = getCurrentInstance();

const formDataRef = ref();
const formData = reactive({});

const dialogConfig = reactive({
  init: 0,
  show: false,
  title: "单个审批",
  btnText: "审批",
  callback: () => {},
  type: "edit",
});

const show = (row, type, callback) => {
  dialogConfig.type = type;
  Object.assign(formData, row);
  dialogConfig.init = row.status;
  if (type === "read") {
    dialogConfig.title = "审批";
  } else if (type === "edit") {
    dialogConfig.title = "单个审批";
    dialogConfig.btnText = "审批";
  } else {
    dialogConfig.title = "批量审批";
    dialogConfig.btnText = "批量审批";
  }
  dialogConfig.callback = callback;
  dialogConfig.show = true;
  nextTick(() => {
    formDataRef.value.resetFields(); 
  });
};

const handleChange = async () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) return;
    let { id, statusRequest, rejectionReason, query } = formData;
    if (Util.getObjType(id) !== "array") {
      id = [id];
    }
    console.log(id)
    let parmas = {
      userIds: id,
      status: statusRequest,
      rejectionReason,
      query
    };
    let res;
    if (dialogConfig.type === "edit3") {
      res = await proxy.$api.updateQueryAllUserMemory(parmas);
    } else {
      res = await proxy.$api.adminUpdateUserMemory(parmas);
    }
    if (!res) return;
    dialogConfig.show = false;
    dialogConfig.callback();
  });
};

defineExpose({ show });
</script>
