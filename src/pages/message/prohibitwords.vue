<template>
  <bd-page class="flex-col">
    <!-- 布局 -->
    <div class="flex-1 el-card border-none flex-col box-border overflow-hidden">
      <div class="h-50px pl-12px pr-12px box-border flex items-center justify-between bd-title">
        <div class="bd-title-left">
          <p class="m-0 font-600">违禁词列表</p>
        </div>
        <div class="flex items-center h-50px">
          <el-form inline>
            <el-form-item class="mb-0 !mr-16px">
              <el-input v-model="queryFrom.search_key" placeholder="请输入违禁词" clearable />
            </el-form-item>
            <el-form-item class="mb-0 !mr-0">
              <el-button type="primary" @click="getTableList">查询</el-button>
              <el-button type="primary" @click="onAddProhitWords">新增违禁词</el-button>
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
              <template v-else>
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
    <!-- 新增违禁词 -->
    <bd-prohit-words v-model:value="prohitWordsValue" @ok="okSand" />
  </bd-page>
</template>

<route lang="yaml">
meta:
  title: 违禁词列表
  isAffix: false
</route>

<script lang="tsx" setup>
import { ElButton, ElSpace, ElText, ElMessage, ElMessageBox } from 'element-plus';
// API 接口
import { messageProhibitWordsGet, messageProhibitWordsDelete } from '@/api/message';
/**
 * 表格
 */
const column = reactive<Column.ColumnOptions[]>([
  {
    prop: 'content',
    label: '违禁词'
  },
  {
    prop: 'is_deleted',
    label: '是否删除',
    width: 160,
    render: (scope: any) => {
      const type = scope.row['is_deleted'] === 1 ? 'danger' : '';
      return <ElText type={type}> {scope.row['is_deleted'] === 1 ? '是' : '否'}</ElText>;
    }
  },
  {
    prop: 'created_at',
    label: '注册时间',
    width: 220
  },
  {
    prop: 'operation',
    label: '操作',
    align: 'center',
    fixed: 'right',
    width: 120,
    render: (scope: any) => {
      const type = scope.row['is_deleted'] === 0 ? 'danger' : 'warning';
      return (
        <ElSpace>
          <ElButton type={type} onClick={() => onDel(scope.row)}>
            {scope.row['is_deleted'] == 0 ? '删除' : '恢复'}
          </ElButton>
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
  search_key: '',
  page_size: 15,
  page_index: 1
});

const getTableList = () => {
  loadTable.value = true;
  messageProhibitWordsGet(queryFrom).then((res: any) => {
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

// 新增违禁词
const prohitWordsValue = ref<boolean>(false);
const onAddProhitWords = () => {
  prohitWordsValue.value = true;
};

// 确定新增违禁词
const okSand = () => {
  getTableList();
};

// 删除违禁词
const prohitWordsDel = (item: any) => {
  console.log(item);
  const formData = {
    is_deleted: item.is_deleted == 1 ? 0 : 1,
    id: item.id
  };
  const msg = item.is_deleted === 0 ? '删除违禁词成功!' : '恢复违禁词成功!';
  messageProhibitWordsDelete(formData).then((res: any) => {
    if (res.status == 200) {
      getTableList();
      ElMessage({
        type: 'success',
        message: msg
      });
    }
  });
};
// 确定删除违禁词
const onDel = (item: any) => {
  const title = item.is_deleted === 0 ? '删除违禁词' : '恢复违禁词';
  const content = item.is_deleted === 0 ? `确定要删除违禁词[${item.content}]吗` : `确定要恢复违禁词[${item.content}]吗`;
  ElMessageBox.confirm(content, title, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    closeOnClickModal: false,
    type: 'warning'
  })
    .then(() => {
      prohitWordsDel(item);
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消成功！'
      });
    });
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
