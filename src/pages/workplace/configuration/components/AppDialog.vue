<template>
  <el-dialog
    :model-value="value"
    :width="600"
    :align-center="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :draggable="true"
    :z-index="99"
    title="添加应用"
    @close="onClose"
  >
    <div class="h-540px flex-col">
      <el-input v-model="content" class="mb-12px" placeholder="请输入应用名称" maxlength="10" show-word-limit />
      <!-- 表格 -->
      <div class="flex-1 overflow-hidden">
        <el-table
          v-loading="loadTable"
          :data="tableData"
          row-key="app_id"
          :show-header="false"
          style="width: 100%; height: 100%"
          @selection-change="onSelectionChange"
        >
          <el-table-column v-for="(col, index) in column" v-bind="col" :key="index">
            <template #default="{ row }">
              <template v-if="col.render">
                <component :is="col.render" :row="row"> </component>
              </template>
              <template v-else-if="col.formatter">
                <slot :name="col.prop" :row="row">{{ col.formatter(row) }}</slot>
              </template>
              <template v-else-if="col.prop">
                <slot :name="col.prop" :row="row">{{ row[col.prop] }}</slot>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <template #footer>
      <el-space>
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" :loading="loaging" @click="onConfirm">确定</el-button>
      </el-space>
    </template>
  </el-dialog>
</template>

<script lang="ts" name="AppDialog" setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
// API 接口
import { categoryAppPost } from '@/api/workplace/category';
import { appGet } from '@/api/workplace/app';

interface IProps {
  value: boolean;
  data: {
    category_no: string;
  };
}
const props = withDefaults(defineProps<IProps>(), {
  value: false
});

const content = ref('');
const loaging = ref<boolean>(false);

const emits = defineEmits<{
  (e: 'update:value', item: boolean): void;
  (e: 'ok', item: any): void;
}>();

watch(
  () => props.value,
  (n, _o) => {
    props.value = n;
    if (n) {
      getTableList();
    }
  }
);

/**
 * 表格
 */
const column = reactive<Column.ColumnOptions[]>([
  {
    prop: 'name',
    label: '名称'
  },
  {
    prop: 'description',
    label: '描述'
  },
  {
    type: 'selection'
  }
]);
const tableData = ref<any[]>([]);
const loadTable = ref<boolean>(false);
const selectionData = ref<string[]>([]);
const queryFrom = reactive({
  keyword: '',
  page_size: 15,
  page_index: 1
});
// 获取表格数据
const getTableList = () => {
  appGet(queryFrom).then((res: any) => {
    tableData.value = res;
  });
};

const onSelectionChange = (val: any[]) => {
  const opt: string[] = [];
  val.map(item => {
    opt.push(item.app_id);
  });
  selectionData.value = opt;
};

const onClose = () => {
  emits('update:value', false);
};
// 保存
const onConfirm = () => {
  if (selectionData.value.length === 0) {
    return ElMessage.info('请输入分类！');
  }
  const fromData = {
    app_ids: selectionData.value
  };
  loaging.value = true;
  categoryAppPost(fromData, props.data.category_no)
    .then((res: any) => {
      loaging.value = false;
      if (res.status == 200) {
        ElMessage.success('新增应用成功！');
        onClose();
        emits('ok', true);
      }
    })
    .catch(err => {
      loaging.value = false;
      if (err.status == 400) {
        ElMessage.error(err.msg);
      }
    });
};
</script>
