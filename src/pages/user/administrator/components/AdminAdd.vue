<script lang="tsx" name="AdminAdd" setup>
// API 接口
import { adminAdd } from '@/api/user';
import { ElMessage } from 'element-plus';
import type { FormRules, FormInstance } from 'element-plus';

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
    if (!n) {
      formRef.value?.resetFields();
    }
  }
);

interface IFrom {
  name: string;
  login_name: string;
  password: string;
}

const loaging = ref<boolean>(false);
const formRef = ref<FormInstance>();
const formData = reactive<IFrom>({
  name: '',
  login_name: '',
  password: ''
});

const formRule = reactive<FormRules<IFrom>>({
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  login_name: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
});

// 取消
const onClose = () => {
  emits('update:value', false);
};

// 确定
const onSubmit = () => {
  formRef.value?.validate((valid, _fields) => {
    if (valid) {
      loaging.value = true;
      adminAdd(formData)
        .then(res => {
          loaging.value = false;
          if (res.status == 200) {
            ElMessage.success('新增成功！');
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
    }
  });
};
</script>

<template>
  <el-dialog
    :model-value="value"
    :width="460"
    :align-center="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :draggable="true"
    :z-index="99"
    title="新增管理员"
    @close="onClose"
  >
    <el-form ref="formRef" :model="formData" :rules="formRule">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="formData.name" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="账号" prop="login_name">
        <el-input v-model="formData.login_name" placeholder="请输入账号" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="formData.password" type="password" show-password placeholder="请输入密码" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-space>
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" :loading="loaging" @click="onSubmit">确定</el-button>
      </el-space>
    </template>
  </el-dialog>
</template>
