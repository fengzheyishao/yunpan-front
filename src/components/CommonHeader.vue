<template>
    <div class="header">
        <div class="l-content">
            <div class="yunpan-icon">
                <h1>YUNPAN</h1>
            </div>
            <div class="space-class" title="空间使用大小">
                <el-progress
                    :stroke-width="5"
                    width="50"
                    type="dashboard"
                    :color="progressColor"
                    :percentage="spacePercent">
                    <template #default="{ percentage }">
                        <span :style="{'font-size': '10px', 'color': percentage>50?'red':'green'}" >{{ percentage }}%</span>
                    </template>
                </el-progress>
                <span>{{ spaceString }}</span>
            </div>
        </div>
        <div class="r-content">
            <el-popover
                :width="500"
                trigger="click"
                v-model:visible="showUploader"
                :offset="20"
                translate="none"
                :hide-after="0"
                :popper-style="{ padding: '0px' }"
                >
                <template #reference>
                    <el-icon size="30" style="cursor: pointer; color: cadetblue; margin-right: 10px;" @click="handleshowUploader"><Upload /></el-icon>
                </template>
                <template #default>
                    <Uploader></Uploader>
                </template>
            </el-popover>
            <el-dropdown>
                <div class="el-dropdown-link">
                    <el-avatar v-if="store.state.avatar!=''||store.state.avatar" :size="48" :src="getAvatar"/>
                    <el-avatar v-else :size="48" :src="getIconImg()"/>
                </div>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="updateAvatar">
                            修改头像
                        </el-dropdown-item>
                        <el-dropdown-item @click="updatePassword">
                            修改密码
                        </el-dropdown-item>
                        <el-dropdown-item @click="logout"> 退出 </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
            <span class="r-span">{{ props.nickName }}</span>
        </div>
    </div>
    <update-avater ref="updateAvatarRef"></update-avater>
</template>

<script setup>

import { computed, getCurrentInstance, onMounted, ref } from 'vue';
import UpdateAvater from '@/views/UpdateAvater.vue';
import { useAllDateStores } from '@/stores';
import { useRouter } from 'vue-router';
import Utils from '@/utils/Utils';

onMounted(()=>{
    store.reloadSpacePercent();
})

const {proxy} = getCurrentInstance();

const props = defineProps({
  userId: {
    type: String,
  },
  avatar: {
    type: String,
  },
  timestamp: {
    type: Number,
    default: 0,
  },
  nickName: {
    type:String,
  }
});

const updateAvatarRef = ref();

const store = useAllDateStores();

const getAvatar = computed(()=>store.state.avatar);

const getIconImg = ()=>{
    return new URL(proxy.VueCookies.get("userInfo").avatar, import.meta.url).href
  }

const updateAvatar = ()=>{
    const userInfo = Object.assign({}, props);
    updateAvatarRef.value.showUpdateAvater(userInfo);
}

const router = useRouter();
const logout = async ()=>{
    let res = await proxy.$api.logout(()=>{});
    proxy.VueCookies.remove("userInfo");
    store.clean();
    router.push('/login');
    proxy.Message.success("退出登录成功");
}

const showUploader = computed(()=>store.state.showUploaderPlanel);
const handleshowUploader = ()=>{
    store.state.showUploaderPlanel = !store.state.showUploaderPlanel;
}

const progressColor = computed(()=>{
    if (showUploader.value<=60) return 'green';
    else if (showUploader.value<=80) return 'yellow';
    else return 'red';
})

const spaceString = computed(()=>Utils.size2Str(store.state.spacePercent.useSpace)
                            +'/'+Utils.size2Str(store.state.spacePercent.totalSpace));

const spacePercent = computed(()=>{
    return Math.floor(store.state.spacePercent.useSpace/store.state.spacePercent.totalSpace*10000)/100;
});

// const reloadImag = ()=>{
//     imgkey.value = false;
//     imgkey.value = true;
// }

// provide("reloadImag", reloadImag);

</script>

<style lang="less" scoped>
.header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 100%;
    padding: 30px;
    background-color: #aaabbb;
}

.l-content{
    display: flex;
    align-items: center;
    .yunpan-icon{
        margin-left: 20px;
        display: flex;
        h1{
            font-size: 40px;
            font-family: Georgia, 'Times New Roman', Times, serif;
            color: #fff;
            text-shadow: 4px 4px 3px rgba(0, 0, 0, .2);
        }
    }
}

.r-content{
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 10px;
    .r-span{
        margin-left: 10px;
        line-height: 50px;
        justify-content: center;
        text-align: center;
        color:bisque;
    }
}

.space-class{
    display: flex;
    align-items: center;
    margin-left: 30px;
    span{
        font-size: small;
        margin-top: 30px;
    }
}

.el-dropdown-link{

}

.percent-class{
    display: flex;
    flex-direction: column;
}
</style>