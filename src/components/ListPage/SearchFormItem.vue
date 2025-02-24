<template>
  <component
    :is="'el-' + column.search?.type"
    v-model="searchParam[column.prop]"
    :placeholder="column.search?.props?.placeholder"
    v-bind="handleSearchProps"
    :clearable="!column.search?.props?.clearable"
    style="width: 100%"
    @change="column.search?.props.change"
  >
    <template v-if="column.search?.type === 'input' && column.search?.props.append" #prepend>
      <span v-if="column.search?.props.append.type">{{ column.search?.props.append.text }}</span>
      <el-select v-else>
        <component :is="`el-option`" v-for="item in column.search?.props.append.options" :key="item.value" v-bind="item" />
      </el-select>
    </template>
    <template v-if="column.search?.type === 'input' && column.search?.props.pre" #append>
      <span v-if="column.search?.props.pre.type">{{ column.search?.props.pre.btnName }}</span>
      <el-button v-else type="primary" @click="column.search?.props.pre.change">{{ column.search?.props.pre.btnName }}</el-button>
    </template>
    <template v-if="column.search?.type === 'select'">
      <component :is="`el-option`" v-for="item in column.search?.props.options" :key="item.value" v-bind="item" />
    </template>
    <template v-if="column.search?.type === 'radio-group'">
      <component :is="`el-radio`" v-for="item in column.search?.props.options" :key="item.value" v-bind="item" />
    </template>
    <template v-if="column.search?.type === 'cascader'" #default="{ data }">
      <span>{{ data.label }}</span>
    </template>
    <template v-if="column.search?.inputLink" #append>
      <el-button type="primary">
        <div class="flex-start-center">
          <span v-if="column.search?.showPassWord" class="mr8" style="font-size: 12px; color: #ababab">用户名：ZJT 密码：123456</span>
          <el-link :href="searchParam[column.prop]" target="_blank" type="primary">点击查看</el-link>
        </div>
      </el-button>
    </template>
  </component>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  column: {
    type: Object,
    default: () => {}
  },
  searchParam: {
    type: Object,
    default: () => {}
  }
})
const searchParam = computed(() => props?.searchParam)
// 处理透传属性
const handleSearchProps = computed(() => {
  return props.column.search?.props ?? {}
})

</script>


