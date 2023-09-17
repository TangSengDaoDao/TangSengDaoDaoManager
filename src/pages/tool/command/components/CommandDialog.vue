<template>
  <el-dialog
    :model-value="value"
    :width="600"
    :align-center="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :draggable="true"
    :z-index="99"
    :title="title"
    @close="onClose"
  >
    <el-form :model="formData" label-width="96px">
      <el-form-item label="口令">
        <el-input v-model="formData.short_url" placeholder="请输入口令" />
      </el-form-item>

      <el-form-item label="地址">
        <el-input v-model="formData.url" placeholder="请输入地址" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-space>
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" :loading="loaging" @click="onConfirm">保存</el-button>
      </el-space>
    </template>
  </el-dialog>
</template>

<script lang="ts" name="CommandDialog" setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
// API 接口
import { commandPost, commandPut } from '@/api/command';

interface IProps {
  value: boolean;
  title: string;
  type: 'add' | 'edit';
  data: object;
}

const props = withDefaults(defineProps<IProps>(), {
  value: false,
  title: '新增口令',
  type: 'add'
});

const content = ref('');
const loaging = ref<boolean>(false);
const formData = ref({
  short_url: '',
  url: ''
});

const emits = defineEmits<{
  (e: 'update:value', item: boolean): void;
  (e: 'ok', item: any): void;
}>();

watch(
  () => props.value,
  (n, _o) => {
    if (n && props.type === 'edit') {
      formData.value = props.data as any;
    }
    if (!n) {
      formData.value = {
        short_url: '',
        url: ''
      };
    }
  }
);

// 取消
const onClose = () => {
  emits('update:value', false);
};

// 新增口令
const addBanner = () => {
  loaging.value = true;
  commandPost(formData.value)
    .then((res: any) => {
      loaging.value = false;
      if (res.status == 200) {
        ElMessage.success('新增成功！');
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

// 编辑口令
const editBanner = () => {
  loaging.value = true;
  commandPut(formData.value, (props.data as any).id)
    .then((res: any) => {
      loaging.value = false;
      if (res.status == 200) {
        ElMessage.success('编辑成功！');
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
const onConfirm = () => {
  if (props.type === 'add') {
    addBanner();
  }
  if (props.type === 'edit') {
    editBanner();
  }
};
</script>

<style lang="scss" scoped>
.bd-uplod {
  ::v-deep(.el-upload--picture-card) {
    height: 78px;
    width: 78px;
  }

  .avatar {
    height: 78px;
    width: 78px;
  }
}
</style>
