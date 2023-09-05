<template>
  <el-dialog
    :model-value="value"
    :width="600"
    :align-center="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :draggable="true"
    :z-index="99"
    title="新增轮播"
    @close="onClose"
  >
    <el-form :model="formData" label-width="96px">
      <el-form-item label="标题">
        <el-input v-model="formData.title" placeholder="请输入标题" />
      </el-form-item>
      <el-form-item label="图片">
        <el-upload
          ref="upload"
          class="bd-uplod"
          :action="actionURL"
          list-type="picture-card"
          :show-file-list="false"
          :headers="headers"
          :before-upload="beforeAvatarUpload"
          :on-success="handleAvatarSuccess"
        >
          <img v-if="formData.cover" :src="`${BU_DOU_CONFIG.APP_URL}${formData.cover}`" class="avatar" />
          <el-icon v-else><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="打开方式">
        <el-radio-group v-model="formData.jump_type">
          <el-radio :label="0">网页</el-radio>
          <el-radio :label="1">APP</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="地址">
        <el-input v-model="formData.route" placeholder="请输入地址" />
      </el-form-item>
      <el-form-item label="描述">
        <el-input
          v-model="formData.description"
          type="textarea"
          :autosize="{ minRows: 6, maxRows: 8 }"
          placeholder="请输入描述"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-space>
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" :loading="loaging" @click="onSend">保存</el-button>
      </el-space>
    </template>
  </el-dialog>
</template>

<script lang="ts" name="BannerDialog" setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import { useUserStore } from '@/stores/modules/user';
// API 接口
import { bannerPost } from '@/api/workplace/banner';
import { feileGet } from '@/api/file';

import { BU_DOU_CONFIG } from '@/config';

interface IProps {
  value: boolean;
}

const userStore = useUserStore();
const props = withDefaults(defineProps<IProps>(), {
  value: false
});

const content = ref('');
const loaging = ref<boolean>(false);
const formData = reactive({
  cover: '',
  title: '',
  description: '',
  route: '',
  jump_type: 0
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

const headers = {
  token: userStore.token
};
const actionURL = ref('');
const beforeAvatarUpload = async (rawFile: any) => {
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
const handleAvatarSuccess = (response: any, _uploadFile: any) => {
  console.log(response);
  formData.cover = response.path;
};
// 取消
const onClose = () => {
  emits('update:value', false);
};
// 发送
const onSend = () => {
  loaging.value = true;
  bannerPost(formData)
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
