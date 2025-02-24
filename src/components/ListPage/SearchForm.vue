<template>
  <div class="search-form">
    <div class="search-list">
      <div v-for="(i, index) in titleSearchList" :key="index">
        <SearchFormItem :column="i" :searchParam="searchParam" />
      </div>
      <div class="search-control">
        <el-button v-if="searchList.length" icon="Filter" class="filter-style" @click="filterClick">筛选</el-button>
        <el-button type="primary" icon="Search" @click="searchData">搜索</el-button>
        <el-button icon="Delete" @click="resetForm">重置</el-button>
      </div>
    </div>
    <el-form v-if="showMore" ref="filterForm" :model="searchParam">
      <el-row :gutter="24">
        <el-col v-for="(i, index) in searchList" :key="index" :span="i.span || 8">
          <el-form-item :label="i.label ?? ''">
            <SearchFormItem :column="i" :searchParam="searchParam" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script setup>
import { reactive, toRefs, inject, onMounted, ref } from 'vue'
import SearchFormItem from './SearchFormItem.vue'

const state = reactive({
  searchParam: {},
  titleSearchList: [],
  showMore: false
})
const { searchParam, titleSearchList, showMore } = toRefs(state)
const listInject = reactive(inject('listProvide'))
const props = defineProps({
  searchList: {
    type: Array,
    default: () => []
  }
})
const searchInit = () => {
  for (const key in props.searchList) {
    const queryKey = ref(props.searchList[key].prop)
    searchParam.value[queryKey.value] = ''
  }
  if (listInject.titleSearchList.length) {
    const list = listInject.titleSearchList.map((item) => {
      return { ...item, search: item }
    })
    titleSearchList.value = [...list]
  }
}
const filterClick = () => {
  showMore.value = !showMore.value
}
const resetForm = () => {
  for (const key in searchParam.value) {
    if (Object.prototype.hasOwnProperty.call(searchParam.value, key)) {
      searchParam.value[key] = ''
    }
  }
  emit('resetForm')
}
const searchData = () => {
  emit('searchClick')
}
const emit = defineEmits(['searchClick', 'resetForm'])
defineExpose({ searchParam })
onMounted(() => {
  searchInit()
})
</script>

<style lang="less" scoped>
.search-form {
  .search-list {
    /* grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); */
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-gap: 10px;
    margin-bottom: 10px;
  }

  .search-control {
    min-width: 270px;
  }

  .filter-style {
    border-color: var(--theme-color);
    color: var(--theme-color);
  }
}
</style>
