<template>
  <bd-page class="flex-col">
    <div class="flex-1 el-card border-none flex-col box-border overflow-hidden">
      <div class="h-50px pl-12px pr-12px box-border flex items-center justify-between bd-title">
        <div class="bd-title-left">
          <p class="m-0 font-600">口令管理</p>
        </div>
        <div class="flex items-center h-50px">
          <el-form inline>
            <el-form-item class="mb-0 !mr-16px">
              <el-input v-model="queryFrom.keyword" placeholder="名称" clearable />
            </el-form-item>
            <el-form-item class="mb-0 !mr-16px">
              <el-button type="primary" @click="getTableList">查询</el-button>
            </el-form-item>
            <el-form-item class="mb-0 !mr-0">
              <el-button type="primary" @click="onCommandAddClick">新增口令</el-button>
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
    <!-- 口令操作 -->
    <CommandDialog
      v-model:value="commandDialogValue"
      :title="commandDialogTitle"
      :type="commandDialogType"
      :data="commandDialogData"
      @ok="onCommandOk"
    />
  </bd-page>
</template>

<route lang="yaml">
meta:
  title: 口令管理
  isAffix: false
</route>

<script lang="tsx" name="command" setup>
import { ElButton, ElSpace, ElMessage, ElMessageBox } from 'element-plus';
import CommandDialog from './components/CommandDialog.vue';

// API接口
import { commandGet, commandDelete } from '@/api/command';
/**
 * 表格
 */
const column = reactive<Column.ColumnOptions[]>([
  {
    prop: 'short_url',
    label: '口令名称'
  },
  {
    prop: 'url',
    label: '地址'
  },
  {
    prop: 'create_at',
    label: '创建时间'
  },
  {
    prop: 'operation',
    label: '操作',
    width: 150,
    align: 'center',
    render: (scope: any) => {
      return (
        <ElSpace>
          <ElButton type="primary" onClick={() => onCommandEidt(scope.row)}>
            编辑
          </ElButton>
          <ElButton type="danger" onClick={() => onCommandDel(scope.row)}>
            删除
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
  keyword: '',
  page_size: 15,
  page_index: 1
});

// 搜索
const getTableList = () => {
  loadTable.value = true;
  commandGet(queryFrom)
    .then((res: any) => {
      loadTable.value = false;
      tableData.value = res.list;
      total.value = res.count;
    })
    .catch(() => {
      loadTable.value = false;
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

// 新增口令
const commandDialogValue = ref(false);
const commandDialogTitle = ref('新增口令');
const commandDialogType = ref<'add' | 'edit'>('add');
const onCommandAddClick = () => {
  commandDialogTitle.value = '新增口令';
  commandDialogType.value = 'add';
  commandDialogValue.value = true;
};

// 编辑口令
const commandDialogData = ref({});
const onCommandEidt = (item: any) => {
  commandDialogTitle.value = `编辑${item.short_url}`;
  commandDialogData.value = item;
  commandDialogType.value = 'edit';
  commandDialogValue.value = true;
};

// 保存口令
const onCommandOk = () => {
  getTableList();
};

// 删除口令
const onCommandDel = (item: any) => {
  ElMessageBox.confirm(`确定要对该口令吗?`, `操作提示`, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    closeOnClickModal: false,
    type: 'warning'
  })
    .then(() => {
      commandDelete(item.id)
        .then((_res: any) => {
          getTableList();
          ElMessage({
            type: 'success',
            message: `口令删除成功！`
          });
        })
        .catch(err => {
          if (err.status == 400) {
            ElMessage.error(err.msg);
          }
        });
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消成功！'
      });
    });
};

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
