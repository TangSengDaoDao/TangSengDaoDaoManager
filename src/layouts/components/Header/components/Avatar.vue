<template>
  <el-dropdown trigger="click" placement="bottom-end">
    <div class="flex items-center cursor-pointer">
      <span class="username">{{ username }}</span>
      <div class="avatar">
        <img :src="headerUrl" alt="avatar" />
      </div>
    </div>

    <template #dropdown>
      <el-dropdown-menu class="w-180px">
        <el-dropdown-item @click="onChangePassword">
          <el-icon>
            <i-bd-lock theme="outline" size="24" />
          </el-icon>
          修改密码
        </el-dropdown-item>
        <el-dropdown-item divided @click="onLogoutClick">
          <el-icon>
            <i-bd-power theme="outline" size="24" />
          </el-icon>
          安全退出
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/modules/user';
import { LOGIN_URL, BU_DOU_CONFIG } from '@/config';

const router = useRouter();
const userStore = useUserStore();
const username = computed(() => {
  return userStore.userInfo.name;
});

const headerUrl = computed(() => {
  return `${BU_DOU_CONFIG.APP_URL}users/${userStore.userInfo.uid}/avatar`;
});

// 修改密码
const onChangePassword = () => {
  router.push({
    path: '/setting/updatepwd'
  });
};

// 退出登录
const onLogoutClick = () => {
  // 1.清除 Token
  userStore.setToken('');
  userStore.setUserInfo({ name: '您好，超管', uid: '' });
  // 2.重定向到登陆页
  router.replace(LOGIN_URL);
};
</script>
<style lang="scss" scoped>
.username {
  margin: 0 16px;
  font-size: 14px;
  height: 36px;
  line-height: 36px;
  color: var(--el-text-color-primary) !important;
}
.avatar {
  width: 36px;
  height: 36px;
  overflow: hidden;
  border-radius: 50%;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
