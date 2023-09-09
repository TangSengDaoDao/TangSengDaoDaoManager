<template>
  <bd-page class="flex-col">
    <!-- 布局 -->
    <div class="flex-1 el-card border-none flex-col box-border overflow-hidden">
      <div class="h-50px pl-12px pr-12px box-border flex items-center justify-between bd-title">
        <div class="bd-title-left">
          <p class="m-0 font-600">举报用户</p>
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

<route lang="yaml">
meta:
  title: 举报用户
  isAffix: false
</route>

<script lang="tsx" setup>
import { ElAvatar } from 'element-plus';
import { BU_DOU_CONFIG } from '@/config';
// API 接口
import { reportListGet } from '@/api/report';
/**
 * 表格
 */
const column = reactive<Column.ColumnOptions[]>([
  {
    prop: 'name',
    label: '举报者名称',
    width: 140
  },
  {
    prop: 'uid',
    label: '举报者ID',
    width: 120
  },
  {
    prop: 'channel_name',
    label: '被举报用户名称',
    width: 200
  },
  {
    prop: 'channel_avatar',
    label: '被举报用户头像',
    align: 'center',
    width: 130,
    render: (scope: any) => {
      let img_url = '';
      if (scope.row['channel_id']) {
        img_url = `${BU_DOU_CONFIG.APP_URL}users/${scope.row['channel_id']}/avatar`;
      }
      return (
        <ElAvatar src={img_url} size={54}>
          {scope.row['channel_name']}
        </ElAvatar>
      );
    }
  },
  {
    prop: 'channel_id',
    label: '被举报用户ID',
    width: 200
  },
  {
    prop: 'imgs',
    label: '举报图片',
    minWidth: 120
  },
  {
    prop: 'category_name',
    label: '举报原因',
    minWidth: 180
  },
  {
    prop: 'remark',
    label: '举报说明',
    minWidth: 170
  },
  {
    prop: 'create_at',
    label: '举报时间',
    width: 170
  }
]);
const tableData = ref<any[]>([]);
const loadTable = ref<boolean>(false);
// 分页
const total = ref(0);

// 查询
const queryFrom = reactive({
  channel_type: '1',
  page_size: 15,
  page_index: 1
});

const getTableList = () => {
  loadTable.value = true;
  reportListGet(queryFrom).then((res: any) => {
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
