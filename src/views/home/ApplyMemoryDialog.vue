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
        <el-form-item label="选择申请方式" label-position="right">
          <el-radio-group v-model="switchValue" aria-label="label position">
            <el-radio-button value="1">填写</el-radio-button>
            <el-radio-button value="2">选择</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="switchValue == 1"
          label="申请内存大小"
          prop="requestSize"
          :rules="[{
            required: true,
            message: '请输入申请内存大小',
            trigger: 'blur',
          }]"
        >
          <el-input
            clearable
            placeholder="请输入申请内存大小"
            v-model="formData.requestSize"
          >
            <template #suffix>MB</template>
          </el-input>
        </el-form-item>
        <el-form-item
          v-else
          label="申请内存大小"
          prop="requestSize"
          :rules="[{
            required: true,
            message: '请选择申请内存大小',
            trigger: 'change',
          }]"
        >
          <el-select
            clearable
            v-model="formData.requestSize"
            placeholder="请选择申请内存大小"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            type="textarea"
            clearable
            placeholder="请输入备注"
            v-model="formData.notes"
            :autosize="{ minRows: 4}"
          />
        </el-form-item>
        <template v-if="dialogConfig.type !== 'first'">
          <el-form-item label="申请状态" disabled>
            <el-tag v-if="formData.status === 0" info>待批准</el-tag>
            <el-tag v-if="formData.status === 1" success>已批准</el-tag>
            <el-tag v-if="formData.status === 2" error>已拒绝</el-tag>
          </el-form-item>
          <el-form-item label="审批时间" disabled>
            <el-input
              placeholder="尚未审批"
              v-model="formData.approvalTime"
              disabled
            />
          </el-form-item>
          <el-form-item label="拒绝原因" disabled>
            <el-input
              type="textarea"
              clearable
              placeholder="无"
              v-model="formData.rejectionReason"
              disabled
            />
          </el-form-item>
        </template>
        <el-form-item v-if="dialogConfig.type !== 'read'">
          <el-button @click="applyFunction">{{
            dialogConfig.btnText
          }}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </Dialog>
</template>

<script setup>
import { ref, getCurrentInstance, nextTick, reactive } from "vue";

const { proxy } = getCurrentInstance();

const formDataRef = ref();
const formData = reactive({});
const switchValue = ref("1");

const options = [
  { label: "512MB", value: 512 },
  { label: "1G", value: 1024 },
  { label: "2G", value: 2048 },
  { label: "5G", value: 5120 },
  { label: "10G", value: 10240 },
];

const dialogConfig = reactive({
  show: false,
  title: "申请内存",
  btnText: "申请",
  type: "first",
  callback: () => {}
});

const showCancel = ref(true);

const show = (type, row, callback) => {
  Object.keys(formData).forEach(key => {
    formData[key] = '';
  });
  if (row) Object.assign(formData, row);
  if (type) dialogConfig.type = type;
  dialogConfig.callback = callback
  if (type === "second") {
    dialogConfig.btnText = "重新申请";
  } else {
    dialogConfig.btnText = "申请提交";
  }
  nextTick(() => {
    dialogConfig.show = true;
    showCancel.value = true;
  });
};

const applyFunction = () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) return;
    const { requestSize, notes, id, status } = formData;
    let parmas = {
      requestSize: parseInt(requestSize),
      notes,
    };
    let res;
    if (dialogConfig.type === "second") {
      if (status !== 2) {
        res = await proxy.$api.updateUserMemoryRequestById({ ...parmas, id });
      } else {
        res = await proxy.$api.addUserMemoryApply(parmas);
      }
    } else {
      res = await proxy.$api.addUserMemoryApply(parmas);
    }
    if (!res) return;
    proxy.Message.success("申请成功，等待管理员审核");
    dialogConfig.show = false
    dialogConfig.callback()
  });
};

defineExpose({ show });
</script>

<style lang="less" scoped></style>
