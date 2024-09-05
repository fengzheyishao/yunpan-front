<template>
    <div class="common-layout">
        <el-container class="lay-container">
            <el-header>
                    <common-header 
                    :userId="userInfo.userId"
                    :avatar="userInfo.avatar"
                    :nickName="userInfo.nickName"
                    :timestamp="timestamp"></common-header>
            </el-header>
            <el-container>
                <common-aside class="aside-class"></common-aside>
                <el-main class="right-main">
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script setup>
    import CommonAside from '@/components/CommonAside.vue';
    import CommonHeader from '@/components/CommonHeader.vue';
    import router from '../router';

    import { getCurrentInstance, ref } from 'vue';

    const {proxy} = getCurrentInstance();
    const userInfo = ref(proxy.VueCookies.get("userInfo"));

    const timestamp = ref(0);

    // console.log(proxy.VueCookies.get("userInfo"))
</script>

<style lang="less" scoped>
* {
    margin: 0;
    padding: 0;
}

.common-layout, .lay-container{
    height: 100%;
}

.aside-class {
    height: 100vh;
}
</style>