<template>
    <div class="sys-body">
    <div class="sys-setting-panel">
    <el-form
      :model="formData"
      :rules="rules"
      ref="formDataRef"
      label-width="150px"
      @submit.prevent
    >
      <!--input输入-->
      <el-form-item label="注册邮件标题" prop="registerEmailTitle">
        <el-input
          clearable
          placeholder="请输入注册邮件验证码邮件标题"
          v-model="formData.registerEmailTitle"
        ></el-input>
      </el-form-item>
      <!--textarea输入-->
      <el-form-item label="注册邮件标题" prop="registerEmailContent">
        <el-input
          clearable
          placeholder="请输入注册邮件验证码邮件内容%s占位符为验证码内容"
          v-model="formData.registerEmailContent"
        ></el-input>
      </el-form-item>
      <el-form-item label="初始空间大小" prop="userInitUseSpace">
        <el-input
          clearable
          placeholder="初始空间大小"
          v-model="formData.userInitUseSpace"
        >
          <template #suffix>MB</template>
        </el-input>
      </el-form-item>
      <!-- 单选 -->
      <el-form-item label="" prop="">
        <el-button type="primary" @click="saveSettings">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted } from 'vue';

const { proxy } = getCurrentInstance();
const formDataRef = ref();
const formData = ref({});

const rules = {
  registerEmailTitle: [
    { required: true, message: "请输入注册邮件验证码邮件标题" },
  ],
  registerEmailContent: [
    { required: true, message: "请输入注册邮件验证码邮件内容" },
  ],
  userInitUseSpace: [
    { required: true, message: "请输入初始化空间大小" },
    {
      validator: proxy.Verify.number,
      message: "空间大小只能是数字",
    },
  ],
};

onMounted(()=>{
    getSysSettings();
})

const getSysSettings = async () => {
  let res = await proxy.$api.getSysSettings();
  if (!res) return;
  formData.value = res;
}

const saveSettings = ()=>{
    formDataRef.value.validate(async (valid) => {
        if (!valid) return;
        let params = Object.assign({}, formData.value);
        let res = await proxy.$api.saveSysSettings(params);
        proxy.Message.success("保存成功");
    });
}

</script>

<style lang="less" scoped>
.sys-body{
    width: 100%;
    height: 100%;
    padding: 30px;
}
.sys-setting-panel {
  margin-top: 20px;
  width: 600px;
}
</style>