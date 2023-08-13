<template>
  <el-dialog
    :model-value="value"
    :width="600"
    :align-center="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :draggable="true"
    :z-index="99"
    title="新增应用"
    @close="onClose"
  >
    <el-form :model="formData" label-width="96px">
      <el-form-item label="应用名称">
        <el-input v-model="formData.app_version" placeholder="请输入应用名称" />
      </el-form-item>
      <el-form-item label="应用APP ID">
        <el-input v-model="formData.app_version" placeholder="请输入应用APP ID" />
      </el-form-item>
      <el-form-item label="应用图标">
        <el-upload
          ref="upload"
          class="bd-uplod"
          action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
          list-type="picture-card"
          :limit="1"
          :auto-upload="false"
        >
          <el-icon><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="PC端地址">
        <el-input v-model="formData.app_version" placeholder="请输入PC端地址" />
      </el-form-item>
      <el-form-item label="移动端地址">
        <el-input v-model="formData.app_version" placeholder="请输入移动端地址" />
      </el-form-item>
      <el-form-item label="应用状态">
        <el-checkbox-group v-model="formData.type">
          <el-checkbox label="pc">PC</el-checkbox>
          <el-checkbox label="app">移动端</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="应用描述">
        <el-input
          v-model="formData.update_desc"
          type="textarea"
          :autosize="{ minRows: 6, maxRows: 8 }"
          placeholder="请输入应用描述"
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

<script lang="ts" name="Apply" setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
// API 接口
import { commonAppversionPost } from '@/api/tool';
interface IProps {
  value: boolean;
}
const props = withDefaults(defineProps<IProps>(), {
  value: false
});

const content = ref('');
const loaging = ref<boolean>(false);
const formData = reactive({
  app_version: '',
  os: 'android',
  is_force: 0,
  update_desc: '',
  download_url: '',
  type: []
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

<style lang="scss" scoped>
.bd-uplod {
  ::v-deep(.el-upload--picture-card) {
    height: 78px;
    width: 78px;
  }
}
</style>
