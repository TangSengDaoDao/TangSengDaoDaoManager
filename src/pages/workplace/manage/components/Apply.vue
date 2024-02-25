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
      <el-form-item label="应用名称">
        <el-input v-model="formData.name" placeholder="请输入应用名称" maxlength="10" show-word-limit />
      </el-form-item>
      <el-form-item label="应用图标">
        <el-upload
          ref="upload"
          class="bd-upload"
          :action="actionURL"
          list-type="picture-card"
          :show-file-list="false"
          :headers="headers"
          :before-upload="beforeUploadFile"
          :on-success="onFileSuccess"
        >
          <img v-if="formData.icon" :src="`${BU_DOU_CONFIG.APP_URL}${formData.icon}`" class="avatar" />
          <el-icon v-else><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="打开方式">
        <el-radio-group v-model="formData.jump_type">
          <el-radio :label="0">网页</el-radio>
          <el-radio :label="1">APP</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="网页地址">
        <el-input v-model="formData.web_route" placeholder="请输入网页地址" />
      </el-form-item>
      <el-form-item label="APP地址">
        <el-input v-model="formData.app_route" placeholder="请输入APP地址" />
      </el-form-item>
      <el-form-item label="付款">
        <el-radio-group v-model="formData.is_paid_app">
          <el-radio :label="0">免费</el-radio>
          <el-radio :label="1">付费</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="应用描述">
        <el-input
          v-model="formData.description"
          type="textarea"
          :autosize="{ minRows: 6, maxRows: 8 }"
          placeholder="请输入应用描述"
          show-word-limit
          maxlength="500"
        />
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

<script lang="ts" name="Apply" setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import { useUserStore } from '@/stores/modules/user';
// API 接口
import { appPost, appPut } from '@/api/workplace/app';
import { feileGet } from '@/api/file';

import { BU_DOU_CONFIG } from '@/config';

interface IProps {
  value: boolean;
  title: string;
  type: 'add' | 'edit';
  data: object;
}
const props = withDefaults(defineProps<IProps>(), {
  value: false,
  title: '新增应用',
  type: 'add'
});
const userStore = useUserStore();

const content = ref('');
const loaging = ref<boolean>(false);
const formData = ref({
  icon: '',
  name: '',
  jump_type: 0,
  description: '',
  app_route: '',
  web_route: '',
  is_paid_app: 0
});

const emits = defineEmits<{
  (e: 'update:value', item: boolean): void;
  (e: 'ok', item: any): void;
}>();

watch(
  () => props.value,
  (n, _o) => {
    props.value = n;
    if (n && props.type == 'edit') {
      formData.value = props.data as any;
    }
    if (!n) {
      formData.value = {
        icon: '',
        name: '',
        jump_type: 0,
        description: '',
        app_route: '',
        web_route: '',
        is_paid_app: 0
      };
    }
  }
);

/**
 * 上传图片
 */
const headers = {
  token: userStore.token
};
const actionURL = ref('');
// 图片上传前获取上传地址
const beforeUploadFile = async (rawFile: any) => {
  const fileData = {
    path: `/${rawFile.uid}/${rawFile.name}`,
    type: 'report'
  };
  const res = (await feileGet(fileData)) as any;
  if (res.url) {
    actionURL.value = res.url;
    return true;
  } else {
    return false;
  }
};
// 图片上传成功获取地址
const onFileSuccess = (response: any, _uploadFile: any) => {
  formData.value.icon = response.path;
};

// 取消
const onClose = () => {
  emits('update:value', false);
};

// 新增应用
const addApp = () => {
  loaging.value = true;
  appPost(formData.value)
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

// 编辑
const editApp = () => {
  loaging.value = true;
  const app_id = (props.data as any).app_id;
  appPut(formData.value, app_id)
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
// 发送
const onConfirm = () => {
  // 新增
  if (props.type === 'add') {
    addApp();
  }
  // 编辑
  if (props.type === 'edit') {
    editApp();
  }
};
</script>

<style lang="scss" scoped>
.bd-upload {
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
