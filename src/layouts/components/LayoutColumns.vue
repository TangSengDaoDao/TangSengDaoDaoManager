<template>
  <el-container class="layout">
    <div class="aside-split bg-white dark:bg-dark">
      <div class="logo flex-center">
        <img class="logo-img" src="@/assets/logo.png" alt="logo" />
      </div>
      <el-scrollbar>
        <div class="split-list">
          <div
            v-for="item in menuList"
            :key="item.path"
            class="split-item mb-6px pt-6px pb-6px"
            :class="{ 'split-active': splitActive === item.path || `/${splitActive.split('/')[1]}` === item.path }"
            @click="changeSubMenu(item)"
          >
            <el-icon>
              <component :is="item.meta.icon"></component>
            </el-icon>
            <span class="title">{{ item.meta.title }}</span>
          </div>
        </div>
      </el-scrollbar>
    </div>
    <el-aside :class="{ 'not-aside': !subMenuList.length }" :style="{ width: isCollapse ? '65px' : '210px' }">
      <div class="logo flex-center">
        <span class="logo-text">
          {{ isCollapse ? APP_TITLE_SHORT : APP_TITLE }}
        </span>
      </div>
      <el-scrollbar>
        <el-menu
          :default-active="activeMenu"
          :router="false"
          :collapse="isCollapse"
          :collapse-transition="false"
          :unique-opened="true"
        >
          <SubMenu :menu-list="subMenuList" />
        </el-menu>
      </el-scrollbar>
    </el-aside>
    <el-container>
      <el-header>
        <ToolBarLeft />
        <ToolBarRight />
      </el-header>
      <Main />
    </el-container>
  </el-container>
</template>
<script setup lang="ts" name="layoutColumns">
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/modules/auth';
import { useGlobalStore } from '@/stores/modules/global';
import { BU_DOU_CONFIG } from '@/config';
// 组件
import Main from '@/layouts/components/Main.vue';
import SubMenu from '@/layouts/components/Menu/SubMenu.vue';
import ToolBarLeft from '@/layouts/components/Header/ToolBarLeft.vue';
import ToolBarRight from '@/layouts/components/Header/ToolBarRight.vue';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const globalStore = useGlobalStore();

const isCollapse = computed(() => globalStore.isCollapse);
const menuList = computed(() => authStore.showMenuListGet);
const activeMenu = computed(() => (route.meta.activeMenu ? route.meta.activeMenu : route.path) as string);
const APP_TITLE = BU_DOU_CONFIG.APP_TITLE;
const APP_TITLE_SHORT = BU_DOU_CONFIG.APP_TITLE_SHORT;

const subMenuList = ref<Menu.MenuOptions[]>([]);
const splitActive = ref('');

watch(
  () => [menuList, route],
  () => {
    // 当前菜单没有数据直接 return
    if (!menuList.value.length) return;
    splitActive.value = route.path;
    const menuItem = menuList.value.filter((item: Menu.MenuOptions) => {
      return route.path === item.path || `/${route.path.split('/')[1]}` === item.path;
    });
    if (menuItem[0]?.children?.length) return (subMenuList.value = menuItem[0].children);
    subMenuList.value = [];
  },
  {
    deep: true,
    immediate: true
  }
);

const changeSubMenu = (item: Menu.MenuOptions) => {
  splitActive.value = item.path;
  if (item.children?.length) return (subMenuList.value = item.children);
  subMenuList.value = [];
  router.push(item.path);
};
</script>
<style lang="scss" scoped>
.el-container {
  width: 100%;
  height: 100%;
  .aside-split {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    width: 80px;
    height: 100%;
    border-right: 1px solid var(--el-border-color-light);
    .logo {
      box-sizing: border-box;
      height: 55px;
      .logo-img {
        width: 32px;
        object-fit: contain;
      }
    }
    .el-scrollbar {
      height: calc(100% - 55px);
      .split-list {
        flex: 1;
        padding: 0 6px;
        box-sizing: border-box;

        .split-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          overflow: hidden;

          cursor: pointer;
          transition: all 0.3s ease;
          &:hover {
            background-color: var(--el-menu-active-bg-color) !important;
            .el-icon,
            .title {
              color: var(--el-menu-active-color) !important;
            }
          }
          .el-icon {
            font-size: 22px;
          }
          .title {
            color: var(--el-text-color-primary) !important;
            margin-top: 6px;
            font-size: 14px;
          }
        }
        .split-active {
          background-color: var(--el-menu-active-bg-color) !important;
          .el-icon,
          .title {
            color: var(--el-menu-active-color) !important;
          }
        }
      }
    }
  }
  .not-aside {
    width: 0 !important;
    border-right: none !important;
  }
  .el-aside {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    background-color: var(--el-menu-bg-color);
    border-right: 1px solid var(--el-border-color-light);
    transition: width 0.3s ease;
    .el-scrollbar {
      height: calc(100% - 55px);
      .el-menu {
        width: 100%;
        overflow-x: hidden;
        border-right: none;
      }
    }
    .logo {
      box-sizing: border-box;
      height: 55px;
      border-bottom: 1px solid var(--el-border-color-light);
      .logo-text {
        font-size: 20px;
        font-weight: bold;
        color: var(--el-menu-text-color);
        white-space: nowrap;
      }
    }
  }
  .el-header {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 55px;
    padding: 0 15px;
    background-color: #ffffff;
    border-bottom: 1px solid var(--el-border-color-light);
    :deep(.tool-bar-ri) {
      .toolBar-icon,
      .username {
        color: var(--el-text-color-primary);
      }
    }
  }
}
</style>
