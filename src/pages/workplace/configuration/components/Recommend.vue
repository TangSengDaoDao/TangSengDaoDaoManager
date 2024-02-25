<template>
  <bd-page class="flex-col !p-0">
    <div class="flex-1 el-card border-none flex-col box-border overflow-hidden">
      <div class="h-50px pl-12px pr-12px box-border flex items-center justify-between bd-title">
        <div class="bd-title-left"></div>
        <div class="flex items-center h-50px">
          <el-form inline>
            <el-form-item class="mb-0 !mr-16px">
              <el-input v-model="queryFrom.keyword" placeholder="名称" clearable />
            </el-form-item>
            <el-form-item class="mb-0 !mr-0">
              <el-button type="primary">新增推荐应用</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <div class="flex-1 overflow-hidden p-12px">
        <el-table v-loading="loadTable" :data="tableData" :border="true" style="width: 100%; height: 100%">
          <el-table-column type="index" :width="42" :align="'center'" :fixed="'left'">
            <template #header>
              <i-bd-drag class="cursor-pointer" size="16" />
            </template>
            <template #default>
              <i-bd-drag class="bd-drag cursor-pointer" size="16" />
            </template>
          </el-table-column>
          <el-table-column v-for="item in column" v-bind="item" :key="item.prop">
            <template #default="scope">
              <template v-if="item.render">
                <component :is="item.render" :row="scope.row"> </component>
              </template>
              <template v-else-if="item.formatter">
                <slot :name="item.prop" :row="scope.row">{{ item.formatter(scope.row) }}</slot>
              </template>
              <template v-else-if="item.prop">
                <slot :name="item.prop" :row="scope.row">{{ scope.row[item.prop!] }}</slot>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="bd-card-footer pl-12px pr-12px mb-12px flex items-center justify-between">
        <div></div>
        <el-pagination
          v-model:current-page="queryFrom.page_index"
          v-model:page-size="queryFrom.page_size"
          :page-sizes="[15, 20, 30, 50, 100]"
          :background="true"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="onSizeChange"
          @current-change="onCurrentChange"
        />
      </div>
    </div>
  </bd-page>
</template>

<script lang="tsx" name="Recommend" setup>
import { ElButton, ElSpace, ElImage } from 'element-plus';
import Sortable from 'sortablejs';
import { BU_DOU_CONFIG } from '@/config';
/**
 * 表格
 */
const column = reactive<Column.ColumnOptions[]>([
  {
    prop: 'icon',
    label: '应用LOGO',
    align: 'center',
    width: 100,
    render: (scope: any) => {
      let img_url = '';
      if (scope.row['icon']) {
        img_url = `${BU_DOU_CONFIG.APP_URL}${scope.row.icon}`;
      }
      return <ElImage src={img_url} fit={'scale-down'} class={'w-60px h-60px'} />;
    }
  },
  {
    prop: 'name',
    label: '应用名称',
    width: 160
  },
  {
    prop: 'app_id',
    label: '应用APP ID',
    width: 290
  },
  {
    prop: 'description',
    label: '描述'
  },
  {
    prop: 'operation',
    label: '操作',
    align: 'center',
    render: (_scope: any) => {
      return (
        <ElSpace>
          <ElButton type="primary">配置</ElButton>
        </ElSpace>
      );
    }
  }
]);
const tableData = ref<any[]>([]);
const loadTable = ref<boolean>(false);
// 分页
const total = ref(0);

// 查询
const queryFrom = reactive({
  keyword: '',
  page_size: 15,
  page_index: 1
});

// 搜索
const getTableList = () => {};

// 分页page-size
const onSizeChange = (size: number) => {
  queryFrom.page_size = size;
  getTableList();
};

// 分页page-size
const onCurrentChange = (current: number) => {
  queryFrom.page_index = current;
  getTableList();
};

// 新增版本

// table 拖拽排序
const tableDrop = () => {
  Sortable.create(document.querySelector('.el-table__body-wrapper tbody') as HTMLElement, {
    // draggable: '.bd-drag',
    animation: 300,
    onEnd({ newIndex, oldIndex }: any) {
      const tablesList = [...tableData.value];
      const currRow = tablesList.splice(oldIndex as number, 1)[0];
      tablesList.splice(newIndex as number, 0, currRow);
      tableData.value = tablesList;
    }
  });
};

onMounted(() => {
  tableDrop();
});
</script>

<style lang="scss" scoped>
// 样式
.bd-title {
  border-bottom: 1px solid var(--el-card-border-color);
}
</style>
