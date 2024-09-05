<template>
    <div class="All-boby">
        <el-dialog
        class="cust-dialog"
        :show-close="showClose"
        :draggable="true"
        :model-value="show"
        :title="title"
        :top="top + 'px'"
        :width="width"
        @close="close"
        >
            <div
                class="dialog-body"
                :style="{ 'max-height': maxHeight + 'px', padding: padding + 'px' }"
            >
                <slot></slot>
                </div>
                <template v-if="(buttons && buttons.length > 0) || showCancel">
                    <div class="dialog-footer">
                        <el-button
                            v-for="btn,index in buttons"
                            :key="index"
                            :type="btn.type || 'primary'"
                            @click="btn.click">{{ btn.text }}</el-button>
                        <el-button link @click="close" v-if="showCancel"> 取消 </el-button>
                    </div>
                </template>
        </el-dialog>
    </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
  },
  show: {
    type: Boolean,
    default: false,
  },
  showClose: {
    type: Boolean,
    default: true,
  },
  showCancel: {
    type: Boolean,
    default: true,
  },
  top: {
    type: Number,
    default: 50,
  },
  width: {
    type: String,
    default: "30%",
  },
  buttons: {
    type: Array,
  },
  padding: {
    type: Number,
    default: 15,
  },
});

const maxHeight = window.innerHeight - props.top - 80;

const emit = defineEmits(['close']);
const close = () => {
  emit("close");
};
</script>

<style lang="less" scoped>

.All-boby{
  box-shadow: 4px 4px 3px rgba(0, 0, 0, .1);
}

.cust-dialog {
  margin: 30px auto 10px !important;
  .el-dialog__body {
    padding: 0px;
  }
  .dialog-body {
    border-top: 1px solid #ddd;
    
    min-height: 80px;
    overflow: auto;
  }
  .dialog-footer {
    text-align: right;
    padding: 5px 20px;
  }
}
</style>