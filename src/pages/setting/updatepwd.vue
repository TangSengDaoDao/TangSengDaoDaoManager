<template>
  <bd-page class="flex-col">
    <!-- 布局 -->
    <div class="flex-1 el-card border-none flex-col box-border overflow-hidden">
      <div class="h-50px pl-12px pr-12px box-border flex items-center justify-between bd-title">
        <div class="bd-title-left">
          <p class="m-0 font-600">修改登录密码</p>
        </div>
        <div class="flex items-center h-50px"></div>
      </div>
      <div class="flex-1 overflow-hidden p-12px">
        <div class="w-540px">
          <el-form ref="formRef" :model="formData" :rules="rules" label-width="160px" autocomplete="on">
            <el-form-item label="旧密码：" prop="oldPwd">
              <el-input v-model="formData.oldPwd" type="password" show-password />
            </el-form-item>
            <el-form-item label="新密码：" prop="newPwd">
              <el-input v-model="formData.newPwd" type="password" show-password />
            </el-form-item>
            <el-form-item label="确认密码：" prop="surePwd">
              <el-input v-model="formData.surePwd" type="password" show-password />
            </el-form-item>
            <el-form-item>
              <el-button :loading="loginButLoading" type="primary" @click="onSubmitClick(formRef)"> 提交 </el-button>
              <el-button @click="onResetClick(formRef)"> 重置 </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </bd-page>
</template>

<route lang="yaml">
meta:
  title: 修改登录密码
</route>

<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage } from 'element-plus';
// API 接口
import { userUpdatepasswordPost } from '@/api/setting';
// 表单
const formRef = ref<FormInstance>();
const formData = reactive({
  oldPwd: '',
  newPwd: '',
  surePwd: ''
});
const loginButLoading = ref(false);
// 输入验证
const validateNewpwd = (_rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入新密码'));
  } else {
    if (value.length < 6) {
      callback(new Error('密码长度必须大于6位!'));
    } else {
      callback();
    }
  }
};
const validateSurepwd = (_rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请重新输入密码'));
  } else if (value !== formData.newPwd) {
    callback(new Error('两个输入不匹配!'));
  } else {
    callback();
  }
};
const rules = reactive<FormRules<typeof formData>>({
  oldPwd: { required: true, message: '请输入旧密码', trigger: 'blur' },
  newPwd: { required: true, validator: validateNewpwd, trigger: 'blur' },
  surePwd: { required: true, validator: validateSurepwd, trigger: 'blur' }
});
// 提交
const onSubmitClick = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(valid => {
    if (valid) {
      if (formData.newPwd === formData.surePwd) {
        loginButLoading.value = true;
        userUpdatepasswordPost({
          password: formData.oldPwd,
          new_password: formData.newPwd
        })
          .then((_res: any) => {
            loginButLoading.value = false;
            ElMessage.success('修改成功！');
          })
          .catch(err => {
            loginButLoading.value = false;
            if (err.status == 400) {
              ElMessage.error(err.msg);
            }
          });
      }
    }
  });
};

// 重置
const onResetClick = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};
</script>

<style lang="scss" scoped>
.bd-title {
  border-bottom: 1px solid var(--el-card-border-color);
}
</style>
