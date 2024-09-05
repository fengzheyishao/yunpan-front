<template>
    <div style="overflow:hidden;">
        <el-table
            ref="eltableRef"
            :data="dataSource.list || []"
            :height="tableHeight"
            :stripe="options.strpie"
            :border="options.border"
            header-row-class-name="table-header-row"
            highlight-current-row
            @row-click="handleRowClick"
            @selection-change="handleSelectionChange"
            >
        <el-table-column v-if="options.selectType && options.selectType=='checkbox'"
            type="selection" 
            width="55"
            align="center">
        </el-table-column>
        <el-table-column v-if="options.showIndex"
            label="序号"
            type="index"
            width="60"
            align="center"
            >
        </el-table-column>
        <template v-for="(item, index) in colLabel">
            <template v-if="item.scopedSlots">
                <el-table-column
                    :key="index"
                    :prop="item.prop"
                    :label="item.label"
                    :align="item.align || 'left'"
                    :width="item.width"
                    >
                    <template #default="scope">
                        <slot
                            :name="item.scopedSlots"
                            :index="scope.$index"
                            :row="scope.row"
                        >
                        </slot>
                    </template>
                </el-table-column>
            </template>
            <template v-else>
                <el-table-column
                    :key="index"
                    :prop="item.prop"
                    :label="item.label"
                    :align="item.align || 'left'"
                    :width="item.width"
                    :fixed="item.fixed"
                    >
                </el-table-column>
            </template>
        </template>
        </el-table>
        <div class="pagination" v-if="showPagination">
            <el-pagination
                v-if="dataSource.totalCount"
                background
                :total="dataSource.totalCount"
                :page-sizes="[15, 30, 50, 100]"
                :page-size="dataSource.pageSize"
                :current-page.sync="dataSource.pageNo"
                :layout="layout"
                @size-change="handlePageSizeChange"
                @current-change="handlePageNoChange"
                >
            </el-pagination>
        </div>
    </div>    
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
    dataSource: Object,
    colLabel: Array,
    showPagination: {
        type: Boolean,
        default: true,
    },
    showPageSize: {
        type: Boolean,
        default: true,
    },
    options: {
        type: Object,
        default: {
            extHeiht: 0,
            showIndex: false,
        },
    },
    fetch: Function,
    initFetch: {
        type: Boolean,
        default: true,
    },
});

const layout = computed(() => {
  return `total, ${
    props.showPageSize ? "sizes" : ""
  }, prev, pager, next, jumper`;
});

const topHeight = 60 + 20 + 30 + 20;

const tableHeight = ref(
  props.options.tableHeight
    ? props.options.tableHeight
    : window.innerHeight - topHeight - props.options.extHeight
);

const init = () => {
  if (props.initFetch && props.fetch) {
    props.fetch();
  }
};

init();

const eltableRef = ref();

const clearSelection = ()=>{
    eltableRef.value.clearSelection();
};

const setCurrentRow = (rowKey, rowValue)=>{
    console.log(rowKey, rowValue);
    let row = props.dataSource.list.find((item)=>{
        return item[rowKey] === rowValue;
    });
    eltableRef.value.setCurrentRow(row);
};

defineExpose({ setCurrentRow, clearSelection });

const emit = defineEmits(["rowSelected", "rowClick"]);

const handleRowClick = (row)=>{
    emit("rowClick", row);
}

const handleSelectionChange = (row)=>{
    emit("rowSelected", row);
}

const handlePageSizeChange = (size) => {
  props.dataSource.pageSize = size;
  props.dataSource.pageNo = 1;
  props.fetch();
};

const handlePageNoChange = (pageNo) => {
  props.dataSource.pageNo = pageNo;
  props.fetch();
};

</script>

<style lang="less" scoped>
.pagination{
    display: flex;
    align-items: center;
    justify-content: end;
    padding: 7px 10px 0 10px;
    .el-pagination{
        justify-content: end;
        
    }
}
</style>
    