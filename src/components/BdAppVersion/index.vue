<template>
  <el-dialog
    :model-value="value"
    :width="600"
    :align-center="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :draggable="true"
    :z-index="99"
    title="新增版本"
    @close="onClose"
  >
    <el-form :model="formData" label-width="120px">
      <el-form-item label="升级平台">
        <el-radio-group v-model="formData.os">
          <el-radio label="android"> Android</el-radio>
          <el-radio label="ios">IOS</el-radio>
          <el-radio label="mac">Mac</el-radio>
          <el-radio label="windows">Windows</el-radio>
          <el-radio label="linx">Linux</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="升级操作">
        <el-radio-group v-model="formData.is_force">
          <el-radio :label="1">强制更新</el-radio>
          <el-radio :label="0">非强制更新</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="安装包">
        <div class="w-100%">
          <el-upload
            ref="upload"
            :action="actionURL"
            :limit="1"
            :headers="headers"
            :before-upload="beforeUploadFile"
            :on-success="onFileSuccess"
          >
            <template #trigger>
              <el-button type="primary">点击上传安装包</el-button>
            </template>
          </el-upload>
        </div>
      </el-form-item>
      <el-form-item label="SHA512">
        <el-input
          v-model="formData.signature"
          type="textarea"
          placeholder="请输入sha512"
          :autosize="{ minRows: 4, maxRows: 6 }"
        />
      </el-form-item>
      <el-form-item label="版本号">
        <el-input v-model="formData.app_version" placeholder="请输入版本号" />
      </el-form-item>
      <el-form-item label="升级说明">
        <el-input
          v-model="formData.update_desc"
          type="textarea"
          :autosize="{ minRows: 6, maxRows: 8 }"
          placeholder="请输入升级说明如：1、新增朋友圈功能 2、修复已知问题"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-space>
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" :loading="loaging" @click="onSend">发送</el-button>
      </el-space>
    </template>
  </el-dialog>
</template>

<script lang="ts" name="BdAppVersion" setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useUserStore } from '@/stores/modules/user';

// API 接口
import { commonAppversionPost } from '@/api/tool';
import { feileGet } from '@/api/file';

interface IProps {
  value: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
  value: false
});
const emits = defineEmits<{
  (e: 'update:value', item: boolean): void;
  (e: 'ok', item: any): void;
}>();

watch(
  () => props.value,
  (n, _o) => {
    props.value = n;
  }
);

const userStore = useUserStore();
const content = ref('');
const loaging = ref<boolean>(false);
const formData = reactive({
  app_version: '',
  os: 'android',
  is_force: 0,
  update_desc: '',
  download_url: '',
  signature: ''
});

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
    type: 'common'
  };

  const res = (await feileGet(fileData)) as any;
  if (res.url) {
    actionURL.value = `${res.url}&signature=1`;
    return true;
  } else {
    return false;
  }
};

// 图片上传成功获取地址
const onFileSuccess = (response: any, _uploadFile: any) => {
  console.log(response);
  formData.download_url = response.path;
  formData.signature = response.sha512;
};

// 取消
const onClose = () => {
  emits('update:value', false);
};
// 发送
const onSend = () => {
  loaging.value = true;
  commonAppversionPost(formData)
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
</script>
