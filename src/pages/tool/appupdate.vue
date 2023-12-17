<template>
  <bd-page class="flex-col">
    <!-- 布局 -->
    <div class="flex-1 el-card border-none flex-col box-border overflow-hidden">
      <div class="h-50px pl-12px pr-12px box-border flex items-center justify-between bd-title">
        <div class="bd-title-left">
          <p class="m-0 font-600">APP升级</p>
        </div>
        <div class="flex items-center h-50px">
          <el-form inline>
            <el-form-item class="mb-0 !mr-0">
              <el-button type="primary" @click="onAppVersionAdd">新增版本</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="flex-1 overflow-hidden p-12px">
        <el-table v-loading="loadTable" :data="tableData" :border="true" style="width: 100%; height: 100%">
          <el-table-column type="index" :width="42" :align="'center'" :fixed="'left'">
            <template #header>
              <i-bd-setting class="cursor-pointer" size="16" />
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
    <!-- 新增版本 -->
    <bd-app-version v-model:value="appVersionAddValue" @ok="onAppVersionOk" />
  </bd-page>
</template>

<route lang="yaml">
meta:
  title: APP升级
  isAffix: false
</route>

<script lang="tsx" setup>
import { ElButton } from 'element-plus';
// API 接口
import { commonAppversionListGet } from '@/api/tool';
/**
 * 表格
 */
const column = reactive<Column.ColumnOptions[]>([
  {
    prop: 'os',
    label: '升级平台',
    width: 140
  },
  {
    prop: 'app_version',
    label: '升级版本号',
    width: 120
  },
  {
    prop: 'is_force',
    label: '是否强制更新',
    width: 220,
    formatter(row: any) {
      return row.is_force === 1 ? '是' : '否';
    }
  },
  {
    prop: 'update_desc',
    label: '升级说明'
  },
  {
    prop: 'created_at',
    label: '发布时间',
    width: 170
  }
]);
const tableData = ref<any[]>([]);
const loadTable = ref<boolean>(false);
// 分页
const total = ref(0);

// 查询
const queryFrom = reactive({
  page_size: 15,
  page_index: 1
});

const getTableList = () => {
  loadTable.value = true;
  commonAppversionListGet(queryFrom).then((res: any) => {
    loadTable.value = false;
    tableData.value = res.list;
    total.value = res.count;
  });
};

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
const appVersionAddValue = ref<boolean>(false);
const onAppVersionAdd = () => {
  appVersionAddValue.value = true;
};

// 新增成功
const onAppVersionOk = () => {
  getTableList();
};
// 初始化
onMounted(() => {
  getTableList();
});
</script>

<style lang="scss" scoped>
// 样式
.bd-title {
  border-bottom: 1px solid var(--el-card-border-color);
}
</style>
