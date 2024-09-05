<template>
    <div class="avatar-upload">
      <div class="avatar-show">
        
      </div>
      <div class="select-btn">
        <el-upload
          class="avatar-uploader"
          name="file"
          :show-file-list="false"
          accept=".png,.PNG,.jpg,.JPG,.jpeg,.JPEG,.gif,.GIF,.bmp,.BMP"
          :multiple="false"
          :http-request="uploadImage"
        >
          <img :src="localFile" v-if="localFile"/>
          <el-icon v-else><Plus /></el-icon>
        </el-upload>
        <!-- <el-button type="primary">选择</el-button> -->
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, getCurrentInstance } from "vue";

  const { proxy } = getCurrentInstance();
  
  const props = defineProps({
    modelValue: {
      type: Object,
      default: null,
    },
  });
  
  const localFile = ref(null);
  const emit = defineEmits();
  const uploadImage = async (file) => {
    file = file.file;
    let img = new FileReader();
    img.readAsDataURL(file);
    img.onload = ({ target }) => {
      localFile.value = target.result;
    };
    emit("update:modelValue", file);
  };
  </script>
  
  <style lang="less">
  .avatar-upload {
    display: flex;
    justify-content: center;
    align-items: end;
  }

  .avatar-uploader {
    width: 150px;
    height: 150px;
    display: block;
    border: 1px dashed;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    .el-icon, img{
        font-size: 20px;
        color: #8c939d;
        width: 150px;
        height: 150px;
    }
  }

  
  </style>