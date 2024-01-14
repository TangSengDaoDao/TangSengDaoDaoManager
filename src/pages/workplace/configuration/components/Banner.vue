<template>
  <bd-page class="flex-col !p-0">
    <div class="flex-1 el-card border-none flex-col box-border overflow-hidden">
      <div class="h-50px pl-12px pr-12px box-border flex items-center justify-between bd-title">
        <div class="bd-title-left"></div>
        <div class="flex items-center h-50px">
          <el-form inline>
            <el-form-item class="mb-0 !mr-0">
              <el-button type="primary" @click="onBannerDialogValue">新增轮播</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <div class="flex-1 overflow-hidden p-12px">
        <el-table v-loading="loadTable" :data="tableData" row-key="banner_no" :border="true" style="width: 100%; height: 100%">
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
              <template v-else-if="item.prop">
                <slot :name="item.prop" :row="scope.row">{{ scope.row[item.prop!] }}</slot>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 轮播 -->
    <BannerDialog
      v-model:value="bannerDialogValue"
      :title="bannerDialogTitle"
      :type="bannerDialogType"
      :data="bannerDialogData"
      @ok="onBannerOk"
    />
  </bd-page>
</template>

<script lang="tsx" name="Banner" setup>
import { ElButton, ElSpace, ElMessageBox, ElMessage } from 'element-plus';
import { Fancybox } from '@fancyapps/ui';
import Sortable from 'sortablejs';
import BannerDialog from './BannerDialog.vue';
import { BU_DOU_CONFIG } from '@/config';

// API接口
import { bannerGet, bannerDelete, bannerReorderPut } from '@/api/workplace/banner';

/**
 * 表格
 */
// 图片预览
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
const column = reactive<Column.ColumnOptions[]>([
  {
    prop: 'title',
    label: '名称'
  },
  {
    prop: 'cover',
    label: '图片',
    width: 146,
    render: (scope: any) => {
      let img_url = '';
      if (scope.row['cover']) {
        img_url = `${BU_DOU_CONFIG.APP_URL}${scope.row.cover}`;
      }
      return <img src={img_url} class={'w-120px h-60px cursor-pointer'} onClick={() => previewPicture(img_url)} />;
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
    width: 150,
    align: 'center',
    render: (scope: any) => {
      return (
        <ElSpace>
          <ElButton type="primary" onClick={() => onBannerEidt(scope.row)}>
            编辑
          </ElButton>
          <ElButton type="danger" onClick={() => onDelBanner(scope.row)}>
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
  keyword: '',
  page_size: 15,
  page_index: 1
});

// 搜索
const getTableList = () => {
  loadTable.value = true;
  bannerGet(queryFrom)
    .then((res: any) => {
      loadTable.value = false;
      tableData.value = res;
    })
    .catch(() => {
      loadTable.value = false;
    });
};

// 新增轮播
const bannerDialogValue = ref(false);
const bannerDialogTitle = ref('新增轮播');
const bannerDialogType = ref<'add' | 'edit'>('add');
const onBannerDialogValue = () => {
  bannerDialogTitle.value = `新增轮播`;
  bannerDialogType.value = 'add';
  bannerDialogValue.value = true;
};

// 编辑轮播
const bannerDialogData = ref({});
const onBannerEidt = (item: any) => {
  bannerDialogTitle.value = `编辑${item.title}`;
  bannerDialogData.value = item;
  bannerDialogType.value = 'edit';
  bannerDialogValue.value = true;
};

// 保存轮播
const onBannerOk = () => {
  getTableList();
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
      bannerDelete(item.banner_no)
        .then((_res: any) => {
          getTableList();
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

const bannerReorder = (newIndex: string, oldIndex: string) => {
  const fromData = {
    banner_nos: [newIndex, oldIndex]
  };
  bannerReorderPut(fromData).then(res => {
    if (res.status == 200) {
      getTableList();
      ElMessage({
        type: 'success',
        message: `轮播排序成功`
      });
    } else {
      ElMessage({
        type: 'info',
        message: '轮播排序失败!'
      });
    }
  });
};

// tree 拖拽排序
const tableDrop = () => {
  Sortable.create(document.querySelector('.el-table__body-wrapper tbody') as HTMLElement, {
    handle: '.bd-drag',
    animation: 300,
    onEnd(evt: any) {
      const { newIndex, oldIndex } = evt;
      const tablesList = [...tableData.value];
      const currRow = tablesList.splice(oldIndex as number, 1)[0];
      tablesList.splice(newIndex as number, 0, currRow);
      if (oldIndex > newIndex) {
        // 向上排序
        bannerReorder(tablesList[newIndex].banner_no, tablesList[oldIndex].banner_no);
      } else {
        // 向下排序
        bannerReorder(tablesList[oldIndex].banner_no, tablesList[newIndex].banner_no);
      }
    }
  });
};

onMounted(() => {
  getTableList();
  tableDrop();
});
</script>

<style lang="scss" scoped>
// 样式
.bd-title {
  border-bottom: 1px solid var(--el-card-border-color);
}
</style>
