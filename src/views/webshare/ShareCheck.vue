<template>
    <div class="all">
    <div class="share-body">
        <el-card style="max-width: 560px" class="body">
            <template #header>
                <div class="head">
                    <div class="icon">
                        <el-avatar :size="35" :src="getIconImg()"/>
                    </div>
                    <div class="info">
                        <span class="nickName">{{ shareInfo.nickName }}</span>
                        <span class="fileName">分享文件:{{ shareInfo.fileName }}</span>
                    </div>
                </div>
            </template>
            <template #default>
                <div class="body">
                    <el-form
                    :model="formData"
                    :rules="rules"
                    ref="formDataRef"
                    :maxLength="5"
                    @submit.prevent>
                        <el-form-item prop="code">
                            <el-input class="input"
                                v-model="formData.code">
                            </el-input>
                            <el-button type="primary" @click="handleShare">
                                提取文件
                            </el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </template>
            <template #footer>
                <span class="time">分享于{{ shareInfo.shareTime }}</span>
            </template>
        </el-card>
    </div>
</div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue';

import { useRouter,useRoute } from 'vue-router';

const { proxy } = getCurrentInstance();

const formData = ref({});
const shareInfo = ref({});

const rules = {
  code: [
    { required: true, message: "请输入提取码" },
    { min: 5, message: "提取码为5位" },
    { max: 5, message: "提取码为5位" },
  ],
};

const route = useRoute();

onMounted(()=>{
    getShareInfo();
})

const shareId = route.params.shareId;

const getShareInfo = async ()=>{
    let params = {
        shareId: shareId,
    }
    let res = await proxy.$api.getShareInfo(params);
    if (!res) return;
    shareInfo.value = res;
}

const router = useRouter();

const formDataRef = ref();
//bug
const handleShare = ()=>{
    formDataRef.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    let params = {
        shareId: shareId,
        code: formData.value.code,
    }
    let res = await proxy.$api.checkShareCode(params);
    
    router.push(`/share/${shareId}`);
    });
}

const getIconImg = ()=>{
    if (shareInfo.value.avatar) {
        return new URL(`${shareInfo.value.avatar}`, import.meta.url).href;
    }
    else {
        return new URL(proxy.$api.getAvatar(shareInfo.value.userId), import.meta.url).href;
    }
}

</script>

<style lang="less" scoped>
.all {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: linear-gradient(to right, rgb(247, 209, 215), rgb(191, 227, 241));
}
.share-body {
    width: 550px;
    min-height: 360px;
    max-height: 450px;
    margin: 170px auto;
}
.head {
    display: flex;
    .info {
        display:flex;
        width: 100%;
        justify-content: space-between;
        align-items: center;
        font-size: large;
        .nickName {
            margin-left: 20px;
        }
    }
}
.body {
    margin: 15px;
    :deep(.el-form-item__content ) {
        justify-content: space-between;
    }
}

.input {
    min-width: 250px;
    max-width: 300px;
}

.time {
    display: flex;
    justify-content: end;
    font-size: small;
}
</style>