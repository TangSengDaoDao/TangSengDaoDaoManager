<template>
  <bd-page class="flex !p-0">
    <!-- S 左侧分类 -->
    <div class="bd-sort min-w-200px max-w-200px h-full box-border flex flex-col">
      <div class="h-50px pl-12px pr-12px box-border flex items-center justify-between bd-title">
        <div class="bd-title-left font-500 text-14px">分组</div>
        <div class="flex items-center h-50px">
          <i-bd-add :size="22" class="cursor-pointer" />
        </div>
      </div>
      <div class="m-12px">
        <el-input v-model="queryFrom.keyword" placeholder="搜索分类/按回车键搜索" clearable />
      </div>
      <div class="flex-1 overflow-hidden">
        <el-scrollbar>
          <el-tree :data="dataTree">
            <template #default="{ node }">
              <div class="bd-tree-node">
                <div>{{ node.label }}</div>
                <div class="pr-12px flex items-center bd-opt">
                  <i-bd-editor :size="16" class="cursor-pointer pr-4px" />
                  <i-bd-delete :size="16" class="cursor-pointer" />
                </div>
              </div>
            </template>
          </el-tree>
        </el-scrollbar>
      </div>
    </div>
    <!-- E 左侧分类 -->

    <!-- S 右侧 表格 -->
    <div class="flex-1 h-full flex flex-col">
      <div class="h-50px pl-12px pr-12px box-border flex items-center justify-between bd-title">
        <div class="bd-title-left"></div>
        <div class="flex items-center h-50px">
          <el-form inline>
            <el-form-item class="mb-0 !mr-16px">
              <el-input v-model="queryFrom.keyword" placeholder="名称" clearable />
            </el-form-item>
            <el-form-item class="mb-0 !mr-0">
              <el-button type="primary">新增应用</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <!-- 表格 -->
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
              <template v-else>
                <slot :name="item.prop" :row="scope.row">{{ scope.row[item.prop] }}</slot>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页 -->
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
    <!-- E 右侧 表格 -->
  </bd-page>
</template>

<script lang="tsx" name="CustomGroup" setup>
import { ElButton, ElSpace } from 'element-plus';

interface Tree {
  id: number;
  label: string;
}
/**
 * 左侧分类
 */
const dataTree = ref<Tree[]>([
  {
    id: 1,
    label: '项目管理'
  },
  {
    id: 2,
    label: '开发管理'
  }
]);

/**
 * 表格
 */
const column = reactive<Column.ColumnOptions[]>([
  {
    prop: 'name',
    label: '名称'
  },
  {
    prop: 'no',
    label: '编码'
  },
  {
    prop: 'status',
    label: '状态',
    formatter(row: any) {
      return row.status === 1 ? '开启' : '关闭';
    }
  },
  {
    prop: 'des',
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
</script>

<style lang="scss" scoped>
// 分类
.bd-sort {
  border-right: 1px solid var(--el-card-border-color);
}

.bd-tree-node {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  font-size: 14px;

  .bd-opt {
    display: none;
  }

  &:hover {
    .bd-opt {
      display: block;
    }
  }
}

.bd-title {
  border-bottom: 1px solid var(--el-card-border-color);
}
</style>
