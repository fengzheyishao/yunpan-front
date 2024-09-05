<template>
    <div>
      <Dialog
        :show="dialogConfig.show"
        :title="dialogConfig.title"
        :buttons="dialogConfig.buttons"
        width="500px"
        :showCancel="true"
        @close="dialogConfig.show = false"
      >
        <el-form
          :model="formData"
          ref="formDataRef"
          label-width="80px"
          @submit.prevent
        >
          <!--input输入-->
          <el-form-item label="昵称" prop="">
            {{ formData.nickName }}
          </el-form-item>
          <!--textarea输入-->
          <el-form-item label="头像" prop="">
            <AvatarUpload v-model="formData.avatar"></AvatarUpload>
          </el-form-item>
        </el-form>
      </Dialog>
    </div>
  </template>

<script setup>
  import { ref, getCurrentInstance } from 'vue';
  import AvatarUpload from '@/components/AvatarUpload.vue';
  import { useAllDateStores } from '@/stores'

  const formData = ref({});
  const formDataRef = ref();
  const {proxy} = getCurrentInstance();

  const showUpdateAvater = (data) => {
    formData.value = Object.assign({}, data);
    formData.value.avatar = data.userId;
    dialogConfig.value.show = true;
  };

  const dialogConfig = ref({
  show: false,
  title: "修改头像",
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

  // const reloadImag = inject("reloadImag");
  const store = useAllDateStores();

  const submitForm = async ()=>{
     if (!(formData.value.avatar instanceof File)) {
        return;
     }
    //  console.log(formData.value.avatar);
     let params = {
      avatar: formData.value.avatar,
     }
     let res = await proxy.$api.updateUserAvatar(params, ()=>{return});
    //  console.log(res)
    //  if (!res) {
      
    //   return;
    //  }
     dialogConfig.value.show = false;
     const cookeUserInfo = proxy.VueCookies.get("userInfo");
     cookeUserInfo.avatar = proxy.$api.getAvatar(cookeUserInfo.userId, new Date().getTime());
     proxy.VueCookies.set("userInfo", cookeUserInfo, 0);
     proxy.Message.success("修改成功");
     store.state.avatar = cookeUserInfo.avatar;
    //  reloadImag();
  }

  defineExpose({showUpdateAvater});
</script>

<style lang="less" scoped>

</style>