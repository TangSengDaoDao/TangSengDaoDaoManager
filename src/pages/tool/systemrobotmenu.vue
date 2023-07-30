<template>
  <bd-page class="flex-col">
    <!-- 布局 -->
    <div class="flex-1 el-card border-none flex-col box-border overflow-hidden">
      <div class="h-50px pl-12px pr-12px box-border flex items-center justify-between bd-title">
        <div class="bd-title-left">
          <p class="m-0 font-600">系统机器人菜单列表</p>
        </div>
        <div class="flex items-center h-50px"></div>
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
              <template v-else>
                <slot :name="item.prop" :row="scope.row">{{ scope.row[item.prop] }}</slot>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </bd-page>
</template>

<route lang="yaml">
meta:
  title: 系统机器人菜单列表
  isAffix: false
</route>

<script lang="tsx" setup>
import { ElSpace, ElButton, ElTag, ElText } from 'element-plus';
// API 接口
import { robotMenusGet } from '@/api/tool';
/**
 * 表格
 */
const column = reactive<Column.ColumnOptions[]>([
  {
    prop: 'cmd',
    label: '命令',
    width: 140,
    render: (scope: any) => {
      return (
        <ElText type="primary" class={'cursor-pointer'}>
          {scope.row['cmd']}
        </ElText>
      );
    }
  },
  {
    prop: 'robot_id',
    label: '机器人ID',
    width: 140
  },
  {
    prop: 'remark',
    label: '说明'
  },
  {
    prop: 'type',
    label: '类型',
    align: 'center',
    width: 80,
    render: (scope: any) => {
      return <ElTag>{scope.row['type']}</ElTag>;
    }
  },
  {
    prop: 'created_at',
    label: '创建时间',
    width: 170
  },
  {
    prop: 'updated_at',
    label: '更新时间',
    width: 170
  },
  {
    prop: 'operation',
    label: '操作',
    align: 'center',
    fixed: 'right',
    width: 120,
    render: (scope: any) => {
      return (
        <ElSpace>
          <ElButton type="danger" onClick={() => aa(scope.row)}>
            删除
          </ElButton>
        </ElSpace>
      );
    }
  }
]);
const tableData = ref<any[]>([]);
const loadTable = ref<boolean>(false);

// 查询
const queryFrom = reactive({
  robot_id: 'u_10000',
  page_size: 15,
  page_index: 1
});

const getTableList = () => {
  loadTable.value = true;
  robotMenusGet(queryFrom).then((res: any) => {
    loadTable.value = false;
    tableData.value = res;
  });
};

const aa = (a: any) => {
  console.log(a);
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
