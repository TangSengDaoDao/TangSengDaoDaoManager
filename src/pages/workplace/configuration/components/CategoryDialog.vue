<template>
  <el-dialog
    :model-value="value"
    :width="400"
    :align-center="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :draggable="true"
    :z-index="99"
    title="新增分类"
    @close="onClose"
  >
    <div>
      <el-input v-model="content" placeholder="请输入分类" />
    </div>
    <template #footer>
      <el-space>
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" :loading="loaging" @click="onSend">保存</el-button>
      </el-space>
    </template>
  </el-dialog>
</template>

<script lang="ts" name="CategoryDialog" setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
// API 接口
import { categoryPost, categoryPut } from '@/api/workplace/category';
interface IProps {
  value: boolean;
  type: 'add' | 'edit';
  data: {
    category_no?: string;
    name?: string;
    sort_num?: number;
  };
}
const props = withDefaults(defineProps<IProps>(), {
  value: false,
  title: '新增分类',
  type: 'add'
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
    console.log(props.value);
    props.value = n;
    if (n && props.type == 'edit') {
      content.value = props.data?.name || '';
    }
    if (!n) {
      content.value = '';
    }
  }
);
// 取消
const onClose = () => {
  emits('update:value', false);
};

// 新增分类
const addCategor = () => {
  const fromData = {
    name: content.value
  };
  loaging.value = true;
  categoryPost(fromData)
    .then((res: any) => {
      loaging.value = false;
      if (res.status == 200) {
        ElMessage.success('编辑分类成功！');
        content.value = '';
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
// 编辑分类
const editCategor = () => {
  const fromData = {
    name: content.value
  };
  loaging.value = true;
  const category_no = (props.data as any).category_no;
  categoryPut(fromData, category_no)
    .then((res: any) => {
      loaging.value = false;
      if (res.status == 200) {
        ElMessage.success('编辑分类成功！');
        content.value = '';
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

// 保存
const onSend = () => {
  if (!content.value) {
    return ElMessage.info('请输入分类！');
  }
  // 新增
  if (props.type === 'add') {
    addCategor();
  }
  // 编辑
  if (props.type === 'edit') {
    editCategor();
  }
};
</script>
