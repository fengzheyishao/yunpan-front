<template>
  <Dialog
    :show="dialogConfig.show"
    :title="dialogConfig.title"
    :buttons="dialogConfig.buttons"
    :showCancel="showCancel"
    @close="dialogConfig.show = false"
  >
    <div class="shareFile-body">
      <el-form
        :model="formData"
        :rules="rules"
        label-width="100px"
        @submit.prevent
        ref="formDataRef"
      >
        <el-form-item label="文件"> {{ formData.fileName }} </el-form-item>
        <el-form-item label="有效期" prop="validType">
          <el-radio-group v-model="formData.validType">
            <el-radio value="0">1天</el-radio>
            <el-radio value="1">7天</el-radio>
            <el-radio value="2">30天</el-radio>
            <el-radio value="3">永久有效</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item>
          <span><i style="color: red">< ! ></i>注意，由当前时间起开始延长</span>
        </el-form-item> -->
      </el-form>
    </div>
  </Dialog>
</template>

<script setup>
import { ref, getCurrentInstance, nextTick, reactive } from "vue";

const { proxy } = getCurrentInstance();

const rules = {
  validType: [{ required: true, message: "请选择有效期", trigger: 'change' }],
};

const dialogConfig = ref({
  show: false,
  title: "延长分享时间",
  shareId: '',
  buttons: [
    {
      type: "primary",
      text: "确定",
      click: async (row) => {
        const { validType } = formData;
        let parmas = {
          shareId: dialogConfig.value.shareId,
          validType,
        };
        const res = await proxy.$api.extendShareTime(parmas);
        if (!res) return
        proxy.Message.success("延长成功")
        emit('callback')
        dialogConfig.value.show = false
      },
    },
  ],
});

const formData = reactive({validType: 1});
const showCancel = ref(true);
const formDataRef = ref();

const show = (data) => {
  dialogConfig.value.show = true;
  dialogConfig.value.shareId = data.shareId;
  showCancel.value = true;
  nextTick(() => {
    formDataRef.value.resetFields();
    formData.value = Object.assign({}, data);
    dialogConfig.value.buttons[0].text = "确定";
  });
};

defineExpose({ show });

const emit = defineEmits(["callback"]);
</script>
