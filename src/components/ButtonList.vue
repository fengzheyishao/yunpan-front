<template>
  <div :class="{ 'div-body': flex }" :style="{ justifyContent: flex ? props.justifyContent : undefined }">
    <template v-for="(item, index) in btnList" :key="index">
      <el-button
        v-if="judge(item.show)"
        v-bind="item.prop"
        style="font-size: 12px;"
        class="{'btn-list': !flex}"
        @click="item.evt(item)"
      >
        <img v-if="item.img" :src="getAssetsFile(item.img)" class="img-icon" />
        <span> {{ item.name }}</span>
      </el-button>
    </template>
  </div>
</template>

<script setup>
import Util from "@/utils/Util";
import { onMounted } from "vue";

const props = defineProps({
  // img: {
  //   type: String // 图片名称
  // },
  // name: {
  //   type: String,
  //   default: ''
  // },
  // show: {
  //   type: [Function, Boolean],
  //   default: true
  // },
  // evt: {
  //   type: () => Promise
  // }
  btnList: {
    type: Array,
    default: () => [],
  },
  justifyContent: {
    type: String,
    default: 'space-between',
  },
  flex: {
    type: Boolean,
    default: false,
  },
});

const judge = (show) => {
  return Util.getObjType(show) === "function" ? show() : show;
};

onMounted(() => {
  console.log(props);
});
</script>

<style lang="less" scoped>
.div-body {
  display: flex !important;
  flex-direction: row !important;
  align-items: center;
  padding: 0;
  margin: 0;
}

.img-icon {
  margin-right: 5px;
  width: 14px;
  height: 14px;
}

.btn-list {
  margin: 0 10px 0 0 !important;
  padding: 10px 20px;
}
</style>
