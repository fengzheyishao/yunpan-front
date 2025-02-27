<template>
  <div class="list-warp flex-column-1">
    <!-- 查询表单 -->
    <SearchForm v-if="titleSearch.length" ref="searchRef" :searchList="searchList" @search-click="searchClick" @reset-form="resetForm" />
    <!-- 表格头部按钮 -->
    <slot name="tableHeader" :multipleSelection="selectedTable" />
    <!-- 表格主体 -->
    <div class="flex-column p-relative">
      <el-table
        ref="tableRef"
        class="flex-column-1 p-absolute"
        v-loading="loading"
        :data="dataList.length ? dataList : tableData"
        row-key="id"
        height="100%"
        :load="load"
        :cell-class-name="tableRowClassName"
        :header-cell-style="{ backgroundColor: '#fafafa' }"
        v-bind="$attrs"
        :tooltip-options="{ placement: 'bottom' }"
        border
      >
        <template v-for="(i, index) in listHeadData" :key="index">
          <el-table-column v-if="i.prop === 'selection' || i.prop === 'index'" v-bind="i" :type="i.prop" :reserve-selection="i.prop === 'selection'" :align="i.align ?? 'center'" />
          <el-table-column v-else-if="i.prop === 'operation'" v-slot="scope" v-bind="i" :align="i.align ?? 'center'">
            <slot :name="i.prop" :row="scope.row" :column="i" />
          </el-table-column>
          <el-table-column v-else-if="i.tag" v-bind="i" :align="i.align ?? 'center'">
            <template #default="scope">
              <el-tag :type="i.tagType ? i.tagType(scope.row[i.prop]) : ''">{{ i.formatter ? i.formatter(scope.row[i.prop]) : scope.row[i.prop] }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column v-else-if="i.tagTip" v-bind="i" :align="i.align ?? 'center'">
            <template #default="scope">
              <el-popover placement="right" width="400" trigger="click">
                {{ i.formatterTip ? i.formatterTip(scope.row[i.prop]) : scope.row[i.prop] }}
                <template #reference>
                  <el-tag :type="i.tagType ? i.tagType(scope.row[i.prop]) : ''">{{ i.formatter ? i.formatter(scope.row[i.prop]) : scope.row[i.prop] }}</el-tag>
                </template>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column v-else-if="i.link" v-bind="i" :align="i.align ?? 'center'" show-overflow-tooltip>
            <template #default="scope">
              <a style="color: #4095e5; cursor: pointer" @click="i.evt ? i.evt(scope.row) : ''">{{ scope.row[i.prop] }}</a>
            </template>
          </el-table-column>
          <el-table-column v-else v-bind="i" :align="i.align ?? 'center'" :resizable="i.resizable ?? true">
            <template #default="scope">
              <Tooltip :content="i.formatter ? i.formatter(scope.row[i.prop], scope.row) : scope.row[i.prop] + ''" :lineClamp="i.line || 1" />
            </template>
          </el-table-column>
        </template>
        <template #empty>
          <div>
            <el-empty v-if="!loading" />
          </div>
        </template>
      </el-table>
    </div>
    <!-- 表格分页 -->
    <el-pagination
      v-if="pagination"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      style="padding-bottom: 10px;"
      :page-sizes="[15, 20, 30, 40, 50]"
      layout="->,total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup>
import {ref, reactive, onBeforeMount, toRefs, provide} from 'vue'
import Tooltip from './Tooltip.vue'
import SearchForm from './SearchForm.vue'

const props = defineProps({
  listHeadData: {
    type: Array,
    default: () => []
  }, // 表格配置项
  titleSearch: {
    type: Array,
    default: () => []
  }, // 头部第一列搜索配置项
  searchList: {
    type: Array,
    default: () => []
  }, // 头部筛选搜索配置项
  requestListData: {
    type: Array,
    default: () => {}
  }, // 请求表格数据的api
  resetForm: {
    type: Function,
    default: () => {}
  }, // 重置按钮事件
  dataList: {
    type: Array,
    default: () => []
  }, // 支持传递 table 数据
  pagination: {
    type: Boolean,
    default: true
  }, // 是否显示分页
})

const state = reactive({
  searchList: [],
  tableData: [],
  currentPage: 1,
  pageSize: 15,
  total: 0,
  loading: false
})
const { tableData, searchList, currentPage, pageSize, total, loading } = toRefs(state)
const tableRef = ref()
const selectedTable = ref([])
const searchRef = ref()

provide('listProvide', {
  titleSearchList: props.titleSearch
})
// 双击获取点击当前行、列索引
const tableRowClassName = ({ row, column, rowIndex, columnIndex }) => {
  row.rowIndex = rowIndex
  column.rowIndex = columnIndex
}
const load = (row, treeNode, resolve) => {
  setTimeout(() => {
    resolve(tableData.value)
  }, 1000)
}

const initListPage = () => {
  // 获取作为筛选条件的数据
  let infoData = []
  props.listHeadData.map((item) => {
    if (item.search) {
      infoData.push(Object.assign({}, item, { label: item.search.label || item.label }))
    }
  })
  infoData = props.searchList.concat(infoData)
  searchList.value = [...infoData]
}
const searchClick = () => {
  tableRef.value.clearSelection()
  renderData(searchRef.value?.searchParam)
}
const handleSizeChange = (val) => {
  pageSize.value = val
  searchClick()
}
const handleCurrentChange = (val) => {
  currentPage.value = val
  searchClick()
}
const resetForm = () => {
  tableRef.value.clearSelection()
  props.resetForm()
  renderData()
}
const renderData = async (query = {}) => {
  loading.value = true
  try {
    const data = await props.requestListData({
      pageSize: pageSize.value,
      pageNo: currentPage.value,
      ...query
    })
    if (data) {
      tableData.value = data.listData
      pageSize.value = data.pageSize
      total.value = data.total
    }
  } catch (error) {}
  loading.value = false
}
const getSelectData = () => {
  return tableRef.value.getSelectionRows()
}
defineExpose({ searchClick, renderData, getSelectData, tableRef })

onBeforeMount(() => {
  if (props.dataList.length) return
  initListPage()
  renderData()
})
</script>

<style lang="less" scoped>
.list-warp {
  background-color: #ffffff;
  padding: 10px;

  > div {
    margin-top: 10px;
  }

  // 使用 :deep() 代替 /deep/ 或 ::v-deep
  :deep(.index-custom) {
    padding: 12px 4px;

    .cell {
      display: flex;
      align-items: center;
    }
  }

  :deep(.el-form-item) {
    margin-bottom: 12px;
  }

  :deep(.el-table) {
    thead .index-custom .cell {
      justify-content: center;
    }

    .cell {
      padding: 0;
    }

    .el-table__row--level-1 .el-table__placeholder {
      width: 10px;
    }
  }

  :deep(.el-table--border th.el-table__cell) {
    border-right-color: #fafafa;
  }

  :deep(.el-table__inner-wrapper::after),
  :deep(.el-table--border::after),
  :deep(.el-table__border-left-patch) {
    background-color: #ffffff;
  }

  :deep(.el-table-fixed-column--left.is-last-column.el-table__cell),
  :deep(.el-table--border .el-table__cell) {
    border-right: none !important;
  }
}

.flex-column-1 {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.p-relative {
  position: relative;
}

.p-absolute {
  position: absolute;
}

.flex-column {
  display: flex;
  flex-direction: column;
  height: 73%;
}
</style>
