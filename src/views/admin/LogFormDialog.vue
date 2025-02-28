<template>
  <Dialog
    :show="dialogConfig.show"
    :title="dialogConfig.title"
    :showCancel="false"
    width="50%"
    @close="dialogConfig.show = false"
  >
    <div>
      <el-form :model="formData" ref="formDataRef" label-width="120px" disabled>
        <el-form-item label="url地址">
          <el-input v-model="formData.url" disabled />
        </el-form-item>
        <el-form-item label="请求方法">
          <el-tag type="warning">{{ formData.method }}</el-tag>
        </el-form-item>
        <el-form-item label="状态">
          <el-tag v-if="formData.logStatus === 1" type="info">临时</el-tag>
          <el-tag v-else-if="formData.logStatus === 2" type="success"
            >成功</el-tag
          >
          <el-tag v-else-if="formData.logStatus === 3" type="error"
            >异常</el-tag
          >
          <el-tag v-else type="warning">其他</el-tag>
        </el-form-item>
        <el-form-item label="时间戳">
          <el-input v-model="formData.timestamp" disabled />
        </el-form-item>
        <el-form-item label="状态码">
          <el-input v-model="formData.responseStatus" disabled />
        </el-form-item>
        <el-form-item label="请求头">
          <el-input
            type="textarea"
            v-model="formData.requestHeaders"
            :autosize="{ minRows: 4, maxRows: 6 }"
            disabled
          />
        </el-form-item>
        <el-form-item label="请求体">
          <el-input
            type="textarea"
            v-model="formData.requestBody"
            :autosize="{ minRows: 4, maxRows: 6 }"
            disabled
          />
        </el-form-item>
        <el-form-item type="textarea" label="响应体">
          <el-input
            type="textarea"
            v-model="formData.responseBody"
            :autosize="{ minRows: 4, maxRows: 6 }"
            disabled
          />
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
  show: false,
  title: "日志详细",
});

const show = (row) => {
  Object.keys(formData).forEach((key) => {
    formData[key] = "";
  });
  Object.assign(formData, row);
  dialogConfig.show = true;
  nextTick(() => {
    formDataRef.value.resetFields();
  });
};

defineExpose({ show });
</script>
