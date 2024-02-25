<template>
  <bd-page class="flex-col">
    <div class="flex-1 el-card border-none flex-col box-border overflow-hidden">
      <div class="h-50px pl-12px pr-12px box-border flex items-center justify-between bd-title">
        <div class="bd-title-left">
          <p class="m-0 font-600">应用管理</p>
        </div>
        <div class="flex items-center h-50px">
          <el-form inline>
            <el-form-item class="mb-0 !mr-16px">
              <el-input v-model="queryFrom.keyword" placeholder="应用名称" clearable />
            </el-form-item>
            <el-form-item class="mb-0 !mr-16px">
              <el-button type="primary" @click="getTableList">查询</el-button>
            </el-form-item>
            <el-form-item class="mb-0 !mr-0">
              <el-button type="primary" @click="onAppVersionAdd">新增应用</el-button>
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
    <!-- 应用 -->
    <Apply v-model:value="applyAddValue" :type="applyType" :title="applyTitle" :data="applyData" @ok="onApplyClick" />
  </bd-page>
</template>

<route lang="yaml">
meta:
  title: 应用管理
  isAffix: false
</route>

<script lang="tsx" setup>
import { ElButton, ElMessageBox, ElMessage, ElSpace } from 'element-plus';
import { Fancybox } from '@fancyapps/ui';
import Apply from './components/Apply.vue';
import { BU_DOU_CONFIG } from '@/config';

// API接口
import { appGet, appDelete } from '@/api/workplace/app';
/**
 * 新增应用
 */
// 新增版本
const applyAddValue = ref<boolean>(false);
const applyTitle = ref('新增应用');
const applyType = ref<'add' | 'edit'>('add');
const onAppVersionAdd = () => {
  applyAddValue.value = true;
  applyTitle.value = '新增应用';
  applyType.value = 'add';
};

// 确定应用
const onApplyClick = () => {
  getTableList();
};

const previewPicture = (url: string) => {
  const imgList = [];
  imgList.push({ src: url });
  Fancybox.show(imgList, {
    Toolbar: {
      display: {
        left: ['infobar'],
        middle: ['zoomIn', 'zoomOut', 'toggle1to1', 'rotateCCW', 'rotateCW', 'flipX', 'flipY'],
        right: ['slideshow', 'thumbs', 'close']
      }
    }
  });
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
      return <img src={img_url} class={'w-60px h-60px cursor-pointer'} onClick={() => previewPicture(img_url)} />;
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
    prop: 'status',
    label: '应用状态',
    width: 100,
    formatter(row: any) {
      return row.status === 1 ? '开启' : '关闭';
    }
  },
  {
    prop: 'description',
    label: '应用描述'
  },
  {
    prop: 'operation',
    label: '操作',
    width: 150,
    align: 'center',
    render: (scope: any) => {
      return (
        <ElSpace>
          <ElButton type="primary" onClick={() => oApplyEidt(scope.row)}>
            编辑
          </ElButton>
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
  appGet(queryFrom)
    .then((res: any) => {
      loadTable.value = false;
      tableData.value = res.list || [];
      total.value = res.count || 0;
    })
    .catch(() => {
      loadTable.value = false;
    });
};

// 编辑
const applyData = ref({});
const oApplyEidt = (item: any) => {
  applyTitle.value = `编辑${item.name}`;
  applyData.value = item;
  applyType.value = 'edit';
  applyAddValue.value = true;
};

// 删除应用
const onDelApply = (item: any) => {
  ElMessageBox.confirm(`确定要对该应用删除吗?`, `操作提示`, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    closeOnClickModal: false,
    type: 'warning'
  })
    .then(() => {
      appDelete(item.app_id)
        .then((_res: any) => {
          getTableList();
          ElMessage({
            type: 'success',
            message: `应用删除成功！`
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
