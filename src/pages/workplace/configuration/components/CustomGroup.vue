<template>
  <bd-page class="flex !p-0">
    <!-- S 左侧分类 -->
    <div class="bd-sort min-w-200px max-w-200px h-full box-border flex flex-col">
      <div class="h-50px pl-12px pr-12px box-border flex items-center justify-between bd-title">
        <div class="bd-title-left font-500 text-14px">分组</div>
        <div class="flex items-center h-50px">
          <i-bd-add :size="22" class="cursor-pointer" @click="categoryDialogValue = true" />
        </div>
      </div>
      <div class="m-12px">
        <el-input v-model="keyword" placeholder="搜索分类/按回车键搜索" clearable />
      </div>
      <div class="flex-1 overflow-hidden">
        <el-scrollbar>
          <div class="tree-warp p-12px pt-0">
            <div
              v-for="item in dataTree"
              :key="item.category_no"
              class="bd-tree-item"
              :class="{ 'bd-tree-activate': item.category_no === optTree }"
              @click="onOptTreeClick(item.category_no)"
            >
              <div class="mr-4px">
                <i-bd-drag class="bd-drag cursor-pointer" size="14" />
              </div>
              <div class="flex-1 text">{{ item.name }}</div>
              <div class="bd-opt">
                <i-bd-editor :size="16" class="cursor-pointer pr-4px" />
                <i-bd-delete :size="16" class="cursor-pointer" />
              </div>
            </div>
          </div>
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
            <el-form-item class="mb-0 !mr-0">
              <el-button type="primary" @click="appDialogValue = true">新增应用</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <!-- 表格 -->
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
              <template v-else>
                <slot :name="item.prop" :row="scope.row">{{ scope.row[item.prop!] }}</slot>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- E 右侧 表格 -->

    <!-- 新增分类 -->
    <CategoryDialog v-model:value="categoryDialogValue" @ok="onCategoryOk" />

    <!-- 添加应用 -->
    <AppDialog v-model:value="appDialogValue" :data="appDialogData" @ok="onAppDialogOk" />
  </bd-page>
</template>

<script lang="tsx" name="CustomGroup" setup>
import { ElButton, ElSpace, ElImage, ElMessageBox, ElMessage } from 'element-plus';
import Sortable from 'sortablejs';
import CategoryDialog from './CategoryDialog.vue';
import AppDialog from './AppDialog.vue';
import { BU_DOU_CONFIG } from '@/config';

// API接口
import { categoryGet, categoryPut, categoryAppGet, categoryAppDelete } from '@/api/workplace/category';

interface Tree {
  category_no: string;
  name: string;
  sort_num: number;
}
/**
 * 左侧分类
 */
const categoryDialogValue = ref<boolean>(false);
const dataTree = ref<Tree[]>([]);
const optTree = ref('');
const keyword = ref('');
// 获取分类
const getCategoryData = () => {
  categoryGet().then((res: any) => {
    if (res.length > 0) {
      dataTree.value = res;
      if (!optTree.value) {
        optTree.value = res[0].category_no;
      }
    }
  });
};

// 选中
const onOptTreeClick = (no: string) => {
  optTree.value = no;
};

// 确定添加应用
const onCategoryOk = () => {
  getCategoryData();
};

const categoryReorder = (newIndex: string, oldIndex: string) => {
  const fromData = {
    category_nos: [newIndex, oldIndex]
  };
  categoryPut(fromData).then(res => {
    console.log(res);
  });
};

// tree 拖拽排序
const treesDrop = () => {
  Sortable.create(document.querySelector('.tree-warp') as HTMLElement, {
    draggable: '.bd-tree-item',
    animation: 300,
    onEnd({ newIndex, oldIndex }: any) {
      categoryReorder(dataTree.value[newIndex].category_no, dataTree.value[oldIndex].category_no);
      const treesList = [...dataTree.value];
      const currRow = treesList.splice(oldIndex as number, 1)[0];
      treesList.splice(newIndex as number, 0, currRow);
      dataTree.value = treesList;
    }
  });
};

/**
 * 添加应用
 */
const appDialogValue = ref(false);
const appDialogData = ref({
  category_no: ''
});
watch(
  () => optTree.value,
  () => {
    appDialogData.value = {
      category_no: optTree.value
    };
    queryFrom.category_no = optTree.value;
    getTableList();
  }
);
// 确定添加应用
const onAppDialogOk = () => {
  getTableList();
};
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
    width: 84,
    render: (scope: any) => {
      return (
        <ElSpace>
          <ElButton type="danger" onClick={() => onDelApply(scope.row)}>
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
  category_no: ''
});

// 搜索
const getTableList = () => {
  loadTable.value = true;
  categoryAppGet(queryFrom)
    .then((res: any) => {
      loadTable.value = false;
      tableData.value = res;
    })
    .catch(() => {
      loadTable.value = false;
    });
};

// 移除应用
const onDelApply = (item: any) => {
  ElMessageBox.confirm(`确定要对该应用移除吗?`, `操作提示`, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    closeOnClickModal: false,
    type: 'warning'
  })
    .then(() => {
      const fromLiftban = {
        category_no: optTree.value,
        app_id: item.app_id
      };
      categoryAppDelete(fromLiftban)
        .then((_res: any) => {
          getTableList();
          ElMessage({
            type: 'success',
            message: `应用移除成功！`
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
  getCategoryData();
  treesDrop();
  tableDrop();
});
</script>

<style lang="scss" scoped>
// 分类
.bd-sort {
  border-right: 1px solid var(--el-card-border-color);
}

.bd-tree-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  height: 26px;
  padding: 0 4px;
  cursor: pointer;
  border-radius: 4px;
  margin-bottom: 4px;

  .bd-opt {
    display: none;
  }

  &:hover {
    background-color: var(--el-menu-active-bg-color);
    color: var(--el-menu-active-color);
    .bd-opt {
      display: block;
    }
  }
}

.bd-tree-activate {
  background-color: var(--el-menu-active-bg-color);
  .text {
    color: var(--el-menu-active-color);
  }
}

.bd-title {
  border-bottom: 1px solid var(--el-card-border-color);
}
</style>
