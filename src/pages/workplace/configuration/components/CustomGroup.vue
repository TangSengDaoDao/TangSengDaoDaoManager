<template>
  <bd-page class="flex !p-0">
    <!-- S 左侧分类 -->
    <div class="bd-sort min-w-200px max-w-200px h-full box-border flex flex-col">
      <div class="h-50px pl-12px pr-12px box-border flex items-center justify-between bd-title">
        <div class="bd-title-left font-500 text-14px">分组</div>
        <div class="flex items-center h-50px">
          <i-bd-add :size="22" class="cursor-pointer" @click="onCategoryAdd" />
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
                <i-bd-editor :size="16" class="cursor-pointer pr-4px" @click.stop="onCategoryEdit(item)" />
                <i-bd-delete :size="16" class="cursor-pointer" @click.stop="onCategoryDelete(item)" />
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
        <el-table v-loading="loadTable" :data="tableData" row-key="app_id" :border="true" style="width: 100%; height: 100%">
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
    <CategoryDialog
      v-model:value="categoryValue"
      :type="categoryType"
      :title="categoryTitle"
      :data="categoryData"
      @ok="onCategoryOk"
    />

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
import {
  categoryGet,
  categoryDelete,
  categoryReorderPut,
  categoryAppGet,
  categoryAppDelete,
  categorysAppsReorderPut
} from '@/api/workplace/category';

interface Tree {
  category_no: string;
  name: string;
  sort_num: number;
}
/**
 * 左侧分类
 */
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
// 分类排序
const categoryReorder = (newIndex: string, oldIndex: string) => {
  const fromData = {
    category_nos: [newIndex, oldIndex]
  };
  categoryReorderPut(fromData).then(res => {
    if (res.status == 200) {
      getCategoryData();
      ElMessage({
        type: 'success',
        message: `分类排序成功`
      });
    } else {
      ElMessage({
        type: 'info',
        message: '分类排序失败!'
      });
    }
  });
};

// 分类拖拽排序
const treesDrop = () => {
  Sortable.create(document.querySelector('.tree-warp') as HTMLElement, {
    handle: '.bd-drag',
    animation: 300,
    onEnd({ newIndex, oldIndex }: any) {
      const treesList = [...dataTree.value];
      const currRow = treesList.splice(oldIndex as number, 1)[0];
      treesList.splice(newIndex as number, 0, currRow);
      if (oldIndex > newIndex) {
        // 向上排序
        categoryReorder(treesList[newIndex].category_no, treesList[oldIndex].category_no);
      } else {
        // 向下排序
        categoryReorder(treesList[oldIndex].category_no, treesList[newIndex].category_no);
      }
    }
  });
};

const categoryValue = ref(false);
const categoryTitle = ref('新增分类');
const categoryType = ref<'add' | 'edit'>('add');
const categoryData = ref({});

// 分类新增
const onCategoryAdd = () => {
  categoryValue.value = true;
  categoryTitle.value = '新增分类';
  categoryType.value = 'add';
  categoryData.value = {};
};

// 分类编辑
const onCategoryEdit = (item: any) => {
  console.log(item);
  categoryValue.value = true;
  categoryTitle.value = '编辑分类';
  categoryType.value = 'edit';
  categoryData.value = { ...item };
};

// 分类删除
const onCategoryDelete = (item: any) => {
  ElMessageBox.confirm(`确定要对该分类吗?`, `操作提示`, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    closeOnClickModal: false,
    type: 'warning'
  })
    .then(() => {
      categoryDelete(item.category_no)
        .then((_res: any) => {
          getCategoryData();
          ElMessage({
            type: 'success',
            message: `轮播删除成功！`
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
    width: 80,
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
  categoryAppGet(queryFrom.category_no)
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
      categoryAppDelete(optTree.value, item.app_id)
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

const categorysAppsReorder = (new_app_id: string, old_app_id: string) => {
  const fromData = {
    app_ids: [new_app_id, old_app_id]
  };
  categorysAppsReorderPut(fromData, queryFrom.category_no).then(res => {
    if (res.status == 200) {
      getTableList();
      ElMessage({
        type: 'success',
        message: `应用排序成功`
      });
    } else {
      ElMessage({
        type: 'info',
        message: '应用排序失败!'
      });
    }
  });
};

// table 拖拽排序
const tableDrop = () => {
  Sortable.create(document.querySelector('.el-table__body-wrapper tbody') as HTMLElement, {
    handle: '.bd-drag',
    animation: 300,
    onEnd({ newIndex, oldIndex }: any) {
      const tablesList = [...tableData.value];
      const currRow = tablesList.splice(oldIndex as number, 1)[0];
      tablesList.splice(newIndex as number, 0, currRow);
      tableData.value = tablesList;
      if (oldIndex > newIndex) {
        // 向上排序
        categorysAppsReorder(tablesList[newIndex].app_id, tablesList[oldIndex].app_id);
      } else {
        // 向下排序
        categorysAppsReorder(tablesList[oldIndex].app_id, tablesList[newIndex].app_id);
      }
    }
  });
};
/**
 * 初始化数据
 */
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
