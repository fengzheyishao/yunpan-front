<template>
  <Dialog
    :show="dialogConfig.show"
    title="申请内存"
    :showCancel="false"
    width="50%"
    @close="dialogConfig.show = false"
  >
    <div>
      <el-form
        :model="formData"
        :rules="rules"
        ref="formDataRef"
        label-width="120px"
      >
        <el-form-item label="选择申请方式" label-position="right">
          <el-radio-group v-model="switchValue" aria-label="label position">
            <el-radio-button value="1">选择</el-radio-button>
            <el-radio-button value="2">填写</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          v-if="switchValue == 1"
          label="申请内存大小"
          :rules="{
            required: true,
            message: '请输入申请内存大小',
            trigger: 'blur',
          }"
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
          :rules="
            {
              required: true,
              message: '请选择申请内存大小',
              trigger: 'change',
            }
          "
        >
          <el-select
            clearable
            v-model="formData.requestSize"
            placeholder="请选择申请内存大小"
          >
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            type="textarea"
            clearable
            placeholder="请输入备注"
            v-model="formData.notes"
          />
        </el-form-item>
        <el-form-item label="" prop="">
          <el-button @click="applyFunction">申请</el-button>
        </el-form-item>
      </el-form>
    </div>
  </Dialog>
</template>

<script setup>
import { ref, getCurrentInstance, nextTick, reactive } from "vue";

const { proxy } = getCurrentInstance();

const formDataRef = ref();
const formData = ref({});
const switchValue = ref("1");

const dialogConfig = reactive({
  show: false,
});

const showCancel = ref(true);

const show = (row) => {
  nextTick(() => {
    dialogConfig.show = true;
    showCancel.value = true;
  });
};

const applyFunction = async () => {
  let parmas = {
    ...formData.value,
  };
  const res = await proxy.$api.addUserMemoryApply(parmas);
  if (!res) return;
  proxy.Message.success("申请成功，等待管理员审核");
};

defineExpose({ show });
</script>

<style lang="less" scoped></style>
