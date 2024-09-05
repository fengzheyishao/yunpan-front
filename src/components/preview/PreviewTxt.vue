<template>
    <div class="code">
    <div class="top-op">
      <div class="encode-select">
        <el-select
          placeholder="选择编码"
          v-model="encode"
          @change="changeEncode"
        >
          <el-option value="utf8" label="utf8编码"></el-option>
          <el-option value="gbk" label="gbk编码"></el-option>
        </el-select>
        <div class="tips">乱码了？切换编码试试</div>
      </div>
      <div class="copy-btn">
        <el-button type="primary" @click="copy">复制</el-button>
      </div>
    </div>
    <highlightjs autodetect :code="txtContent" />
  </div>
</template>

<script setup>
import useClipboard from "vue-clipboard3";
const { toClipboard } = useClipboard();

import { ref, onMounted, getCurrentInstance } from "vue";

const { proxy } = getCurrentInstance();

const props = defineProps({
  url: {
    type: String,
  },
});

const encode = ref("utf8");
const blobRes = ref();
const txtContent = ref("");

const readTxt = async ()=>{
  let res = await proxy.$api.getRequest(props.url, 'blob');
  if (!res) return;
  blobRes.value = res;
  showTxt();
}

const showTxt = ()=>{
  const reader = new FileReader();
  reader.onload = ()=>{
    let txt = reader.result;
    txtContent.value = txt;
  };
  
  reader.readAsText(blobRes.value, encode.value);
}

const changeEncode = (e)=>{
  encode.value = e;
  showTxt();
}

onMounted(()=>{
  readTxt();
})

const copy = async ()=>{
  await toClipboard(txtContent.value);
  proxy.Message.success("复制成功");
}

</script>

<style lang="less" scoped>
.code {
  padding: 10px 20px;
  width: 100%;
  .top-op {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .encode-select {
    flex: 2;
    display: flex;
    align-items: center;
    margin: 5px 10px;
    .el-select {
      flex: 2;
    }
    .tips {
      flex: 1;
      margin-left: 30px;
      color: #828282;
    }
  }
  .copy-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
  }
  pre {
    margin: 0px;
  }
}
</style>