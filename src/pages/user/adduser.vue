<template>
  <bd-page class="flex-col">
    <!-- 布局 -->
    <div class="flex-1 el-card border-none flex-col box-border overflow-hidden">
      <div class="h-50px pl-12px pr-12px box-border flex items-center justify-between bd-title">
        <div class="bd-title-left">
          <p class="m-0 font-600">添加用户</p>
        </div>
        <div class="flex items-center h-50px"></div>
      </div>
      <div class="flex-1 overflow-hidden p-12px">
        <div class="w-540px">
          <el-form :model="formData" label-width="120px">
            <el-form-item label="区号：">
              <el-select v-model="formData.zone" class="!w-100%">
                <el-option label="0086" value="0086" />
              </el-select>
            </el-form-item>
            <el-form-item label="手机号：">
              <el-input v-model="formData.phone" />
            </el-form-item>
            <el-form-item label="性别：">
              <el-radio-group v-model="formData.sex">
                <el-radio :label="1">男</el-radio>
                <el-radio :label="0">女</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="用户昵称：">
              <el-input v-model="formData.name" />
            </el-form-item>
            <el-form-item label="登录密码：">
              <el-input v-model="formData.password" type="password" show-password />
            </el-form-item>
            <el-form-item>
              <el-button :loading="loginButLoading" class="!w-100%" type="primary" @click="onSaveClick">保存</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </bd-page>
</template>

<route lang="yaml">
meta:
  title: 添加用户
</route>

<script lang="ts" setup>
import { ElMessage } from 'element-plus';
// API 接口
import { userAddPost } from '@/api/user';
// 表单
const formData = reactive({
  name: '',
  zone: '0086',
  sex: 1,
  phone: '',
  password: ''
});

// 更新通用设置
const loginButLoading = ref(false);
const onSaveClick = () => {
  loginButLoading.value = true;
  userAddPost(formData)
    .then((_res: any) => {
      loginButLoading.value = false;
      ElMessage.success('添加成功');
    })
    .catch(err => {
      loginButLoading.value = false;
      if (err.status == 400) {
        ElMessage.error(err.msg);
      }
    });
};
</script>

<style lang="scss" scoped>
.bd-title {
  border-bottom: 1px solid var(--el-card-border-color);
}
</style>
