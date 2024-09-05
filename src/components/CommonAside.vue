<template>
    <el-aside class="aside-body" width="150px">
        <el-scrollbar>
        <el-menu 
        :isCollapse="isCollapse"
        :default-active="activeMenu"
        
        >
            <el-sub-menu 
                v-for="item in itemBoby2"
                :index="item.path"
                :key="item.path"
                >
                <template #title>
                    <component class="icons" :is="item.icon"/>
                    <span style="margin-left: 10px;">{{ item.name }}</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item
                    v-for="it in item.children"
                    :index="it.path"
                    :key="it.path"
                    style="height: 35px;"
                    @click="handlePush(it.path)">
                        <template #title>
                            <component style="height: 13px; width: 13px;" :is="it.icon"/>
                        <span style="margin-left: 10px; line-height: 20px;">{{ it.name }}</span>
                        </template>
                </el-menu-item>
                </el-menu-item-group>
            </el-sub-menu>
        </el-menu>
    </el-scrollbar>
    </el-aside>
</template>

<script setup>
    import {ref, getCurrentInstance, onMounted} from 'vue'
    import { useRouter } from 'vue-router';

    const itemBoby = [
    {
        icon: "HomeFilled",
        name: "首页",
        menuCode: "main",
        path: "/main/all",
        allShow: true,
        children: [
        {
            icon: "Box",
            name: "全部",
            category: "all",
            path: "/main/all",
        },
        {
            icon: "Film",
            name: "视频",
            category: "video",
            path: "/main/video",
        },
        {
            icon: "Headset",
            name: "音频",
            category: "music",
            path: "/main/music",
        },
        {
            icon: "Picture",
            name: "图片",
            category: "image",
            path: "/main/image",
        },
        {
            icon: "Document",
            name: "文档",
            category: "doc",
            path: "/main/doc",
        },
        {
            icon: "MoreFilled",
            name: "其他",
            category: "others",
            path: "/main/others",
        },
        ],
    },
    {
        path: "/myshare",
        icon: "Share",
        name: "分享",
        menuCode: "share",
        allShow: true,
        children: [
        {
            icon: "Link",
            name: "分享记录",
            path: "/myshare",
        },
        ],
    },
    {
        path: "/recycle",
        icon: "DeleteFilled",
        name: "回收站",
        menuCode: "recycle",
        tips: "回收站为你保存10天内删除的文件",
        allShow: true,
        children: [
        {
            icon: "Delete",
            name: "删除的文件",
            path: "/recycle",
        },
        ],
    },
    {
        path: "/settings/fileList",
        icon: "Tools",
        name: "设置",
        menuCode: "settings",
        allShow: false,
        children: [
        {
            icon: "Setting",
            name: "用户文件",
            path: "/settings/fileList",
        },
        {
            icon: "Setting",
            name: "用户管理",
            path: "/settings/userList",
        },
        {
            icon: "Setting",
            path: "/settings/sysSetting",
            name: "系统设置",
        },
        ],
    },
    ]
    
    const isCollapse = ref(false);

    const router = useRouter();

    const handlePush = (path)=>{
        router.push(path);
    }

    const {proxy} = getCurrentInstance();
    const userInfo = proxy.VueCookies.get("userInfo");

    onMounted(()=>{
        if (!userInfo.admin) {
            itemBoby2.value = itemBoby.filter(item=>item.allShow);
        }
        else {
            itemBoby2.value = itemBoby;
        }
    })

    const itemBoby2 = ref();

</script>

<style lang="less" scoped>
.icons{
    height: 30px;
    width: 30px;
    margin-right: 3px;
}

.el-aside{
    border-right: 1px solid #05a1f5;
    // background-color: #05a1f5;
}

.aside-body{
    overflow:auto;
    .el-menu{
        .el-sub-menu{
            font-size: 20px;
            
        }
    }
}



</style>