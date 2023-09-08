<template>
  <bd-page class="flex-col !p-0">
    <div class="flex-1 el-card border-none flex-col box-border overflow-hidden">
      <div class="h-50px pl-12px pr-12px box-border flex items-center justify-between bd-title">
        <div class="bd-title-left"></div>
        <div class="flex items-center h-50px">
          <el-form inline>
            <el-form-item class="mb-0 !mr-16px">
              <el-input v-model="queryFrom.keyword" placeholder="轮播名称" clearable />
            </el-form-item>
            <el-form-item class="mb-0 !mr-0">
              <el-button type="primary" @click="onBannerDialogValue">新增轮播</el-button>
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
                <slot :name="item.prop" :row="scope.row">{{ scope.row[item.prop] }}</slot>
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
    <!-- 轮播 -->
    <BannerDialog v-model:value="bannerDialogValue" />
  </bd-page>
</template>

<script lang="tsx" name="Banner" setup>
import { ElButton, ElSpace, ElImage, ElMessageBox, ElMessage } from 'element-plus';
import BannerDialog from './BannerDialog.vue';
import { BU_DOU_CONFIG } from '@/config';

// API接口
import { bannerGet, bannerDelete } from '@/api/workplace/banner';
/**
 * 表格
 */
const column = reactive<Column.ColumnOptions[]>([
  {
    prop: 'title',
    label: '名称'
  },
  {
    prop: 'cover',
    label: '图片',
    render: (scope: any) => {
      let img_url = '';
      if (scope.row['cover']) {
        img_url = `${BU_DOU_CONFIG.APP_URL}${scope.row.cover}`;
      }
      return <ElImage src={img_url} fit={'scale-down'} class={'w-120px h-60px'} />;
    }
  },
  {
    prop: 'route',
    label: '地址'
  },
  {
    prop: 'status',
    label: '打开方式',
    formatter(row: any) {
      return row.status === 0 ? '网页' : '原生';
    }
  },
  {
    prop: 'description',
    label: '描述'
  },
  {
    prop: 'created_at',
    label: '创建时间',
    width: 180
  },
  {
    prop: 'operation',
    label: '操作',
    align: 'center',
    render: (scope: any) => {
      return (
        <ElSpace>
          <ElButton type="primary">编辑</ElButton>
          <ElButton onClick={() => onDelBanner(scope.row)}>删除</ElButton>
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
  bannerGet(queryFrom).then((res: any) => {
    tableData.value = res;
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

// 新增轮播
const bannerDialogValue = ref(false);
const onBannerDialogValue = () => {
  bannerDialogValue.value = true;
};

// 删除轮播
const onDelBanner = (item: any) => {
  ElMessageBox.confirm(`确定要对该轮播吗?`, `操作提示`, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    closeOnClickModal: false,
    type: 'warning'
  })
    .then(() => {
      const fromLiftban = {
        banner_no: item.banner_no
      };
      bannerDelete(fromLiftban)
        .then((_res: any) => {
          getTableList();
          ElMessage({
            type: 'success',
            message: `轮播群组成功！`
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
