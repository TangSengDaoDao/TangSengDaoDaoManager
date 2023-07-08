<template>
  <div class="h-screen w-full flex flex-1 flex-col justify-center items-center overflow-hidden">
    <div class="login-layout-container bg-[#fff] dark:bg-[#101014]">
      <!-- S LOGO -->
      <!-- <div class="flex justify-start px-2 fixed" style="top: 32px; left: 36px; cursor: pointer; app-region: no-drag">
        <div class="logo-text ml-1" style="width: 115px">
          <img src="@/assets/logo-budou.png" class="h-54px" />
        </div>
      </div> -->
      <!-- E LOGO -->
      <div class="form-wrapper-content">
        <div class="login-main flex flex-col items-center justify-center px-6">
          <el-card class="w-440px login-card" body-style="padding: 48px;">
            <div class="flex justify-center mt-16px">
              <h3 class="text-3xl app-text-fg-high mt-0 mb-24px" style="align-self: flex-start; font-weight: 500">
                {{ APP_TITLE }}
              </h3>
            </div>
            <el-form ref="formRef" :model="loginForm" :rules="rules" size="large" autocomplete="on">
              <el-form-item prop="username">
                <el-input v-model="loginForm.username" placeholder="请输入账号">
                  <template #prefix>
                    <el-icon class="el-input__icon">
                      <i-bd-people theme="outline" size="24" />
                    </el-icon>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input
                  v-model="loginForm.password"
                  type="password"
                  placeholder="请输入密码"
                  show-password
                  @keyup.enter="onLoginClick(formRef)"
                >
                  <template #prefix>
                    <el-icon class="el-input__icon">
                      <i-bd-lock theme="outline" size="24" />
                    </el-icon>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item>
                <div class="flex justify-between">
                  <div class="flex-initial">
                    <el-checkbox v-model="autoLogin">自动登录</el-checkbox>
                  </div>
                </div>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" :loading="loginButLoading" class="w-full" @click="onLoginClick(formRef)">
                  登录
                </el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  title: 登录
  layout: false
</route>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage } from 'element-plus';
import { useUserStore } from '@/stores/modules/user';
import { HOME_URL, BU_DOU_CONFIG } from '@/config';
// API 接口
import { loginPost } from '@/api/basic';

interface RuleForm {
  username: string;
  password: string;
}

const router = useRouter();
const userStore = useUserStore();

const APP_TITLE = BU_DOU_CONFIG.APP_TITLE;

// 登录表单
const formRef = ref<FormInstance>();
const loginForm = reactive<RuleForm>({
  username: '',
  password: ''
});
const rules = reactive<FormRules<RuleForm>>({
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
});
const autoLogin = ref(false);
const loginButLoading = ref(false);

// 登录
const onLoginClick = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  loginButLoading.value = true;
  await formEl.validate(valid => {
    if (valid) {
      loginPost(loginForm)
        .then((res: any) => {
          loginButLoading.value = false;
          userStore.setToken(res.token);
          userStore.setUserInfo(res);
          router.push(HOME_URL);
          ElMessage.success('登录成功');
        })
        .catch(err => {
          loginButLoading.value = false;
          if (err.status == 400) {
            ElMessage.error(err.msg);
          }
        });
    }
  });
};
</script>

<style lang="scss" scope>
.login-layout-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  overflow: auto;
  background-image: url('@/assets/images/bg.svg');
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
}

.logo-text {
  color: #c2cad1;
}

.form-wrapper-content {
  -webkit-app-region: no-drag;
}
.login-main {
  margin: 0 auto;
  -webkit-app-region: no-drag;
}

.dark .login-card {
  border: 1px solid #272835;
  box-shadow: rgba(22, 14, 45, 0.02) 0px 0px 40px, rgba(22, 14, 45, 0.06) 0px 0px 104px !important;
  border-radius: 8px;
  background: #191a23;
}

.login-card {
  border: 1px solid #eaecf0;
  box-shadow: rgba(22, 14, 45, 0.02) 0px 0px 40px, rgba(22, 14, 45, 0.06) 0px 0px 104px !important;
  border-radius: 8px;
  background: #fff;
}
</style>
