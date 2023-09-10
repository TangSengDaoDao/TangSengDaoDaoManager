<template>
  <div class="tabs-box bd-tab bg-white dark:bg-dark">
    <div class="flex-y-center w-full h-44px">
      <div class="flex-1-hidden h-full">
        <div class="bd-tab-container h-full">
          <div
            v-for="item in tabsMenuList"
            :key="item.path"
            class="bd-tab-item transition-all-300"
            :class="tabsMenuValue === item.path ? 'chrome-tab_active' : ''"
            @click.stop="tabClick(item)"
          >
            <div v-if="item.icon && tabsIcon">
              <component :is="'i-bd-add-text'" theme="outline" size="16" class="cursor-pointer" />
            </div>
            <span class="text">{{ item.title }}</span>
            <div v-if="item.close" class="bd-tab-item-colse" @click.stop="tabRemove(item.path)">
              <i-bd-close-small theme="outline" />
            </div>
            <div class="chrome-tab-divider"></div>
          </div>
        </div>
      </div>
      <el-dropdown trigger="click" :teleported="false">
        <div class="h-full flex w-40px items-center justify-center cursor-pointer">
          <i-bd-down theme="outline" size="24" />
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="onRefreshClick">
              <el-icon>
                <i-bd-refresh />
              </el-icon>
              刷新
            </el-dropdown-item>
            <el-dropdown-item @click="onMaximizeClick">
              <el-icon>
                <i-bd-full-screen />
              </el-icon>
              最大化
            </el-dropdown-item>
            <el-dropdown-item divided @click="onCloseCurrentTabClick">
              <el-icon>
                <i-bd-reduce-one />
              </el-icon>
              关闭当前
            </el-dropdown-item>
            <el-dropdown-item @click="onCloseOtherTabClick">
              <el-icon>
                <i-bd-close-one />
              </el-icon>
              关闭其他
            </el-dropdown-item>
            <el-dropdown-item @click="onCloseAllTabClick">
              <el-icon>
                <i-bd-folder-failed />
              </el-icon>
              关闭所有
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router';
import { TabPaneName } from 'element-plus';
import Sortable from 'sortablejs';
import { HOME_URL } from '@/config';
import { useGlobalStore } from '@/stores/modules/global';
import { useTabsStore } from '@/stores/modules/tabs';
import { useAuthStore } from '@/stores/modules/auth';
import { useKeepAliveStore } from '@/stores/modules/keepAlive';

const route = useRoute();
const router = useRouter();
const tabStore = useTabsStore();
const authStore = useAuthStore();
const globalStore = useGlobalStore();
const keepAliveStore = useKeepAliveStore();

const tabsMenuValue = ref(route.fullPath);
const tabsMenuList = computed(() => tabStore.tabsMenuList);
const tabsIcon = computed(() => globalStore.tabsIcon);

onMounted(() => {
  tabsDrop();
  initTabs();
});

// 监听路由的变化（防止浏览器后退/前进不变化 tabsMenuValue）
watch(
  () => route.fullPath,
  () => {
    if (route.meta.isFull) return;
    tabsMenuValue.value = route.fullPath;
    const tabsParams = {
      icon: route.meta.icon as string,
      title: route.meta.title as string,
      path: route.fullPath,
      name: route.name as string,
      close: !route.meta.isAffix
    };
    tabStore.addTabs(tabsParams);
    route.meta.isKeepAlive && keepAliveStore.addKeepAliveName(route.name as string);
  },
  { immediate: true }
);

// tabs 拖拽排序
const tabsDrop = () => {
  Sortable.create(document.querySelector('.bd-tab-container') as HTMLElement, {
    draggable: '.bd-tab-item',
    animation: 300,
    onEnd({ newIndex, oldIndex }: any) {
      const tabsList = [...tabStore.tabsMenuList];
      const currRow = tabsList.splice(oldIndex as number, 1)[0];
      tabsList.splice(newIndex as number, 0, currRow);
      tabStore.setTabs(tabsList);
    }
  });
};

// 初始化需要固定的 tabs
const initTabs = () => {
  authStore.flatMenuListGet.forEach(item => {
    if (item.meta.isAffix && !item.meta.isHide && !item.meta.isFull) {
      const tabsParams = {
        icon: item.meta.icon,
        title: item.meta.title,
        path: item.path,
        name: item.name,
        close: !item.meta.isAffix
      };
      tabStore.addTabs(tabsParams);
    }
  });
};

// Tab Click
const tabClick = (tabItem: any) => {
  const path = tabItem.path;
  router.push(path);
};

// Remove Tab
const tabRemove = (fullPath: TabPaneName) => {
  const name = tabStore.tabsMenuList.filter(item => item.path == fullPath)[0].name || '';
  keepAliveStore.removeKeepAliveName(name);
  tabStore.removeTabs(fullPath as string, fullPath == route.fullPath);
};

// refresh current page
const refreshCurrentPage: Function = inject('refresh') as Function;
const onRefreshClick = () => {
  setTimeout(() => {
    keepAliveStore.removeKeepAliveName(route.name as string);
    refreshCurrentPage(false);
    nextTick(() => {
      keepAliveStore.addKeepAliveName(route.name as string);
      refreshCurrentPage(true);
    });
  }, 0);
};

// maximize current page
const onMaximizeClick = () => {
  globalStore.setGlobalState('maximize', true);
};

// Close Current
const onCloseCurrentTabClick = () => {
  if (route.meta.isAffix) return;
  tabStore.removeTabs(route.fullPath);
  keepAliveStore.removeKeepAliveName(route.name as string);
};

// Close Other
const onCloseOtherTabClick = () => {
  tabStore.closeMultipleTab(route.fullPath);
  keepAliveStore.setKeepAliveName([route.name] as string[]);
};

// Close All
const onCloseAllTabClick = () => {
  tabStore.closeMultipleTab();
  keepAliveStore.setKeepAliveName();
  router.push(HOME_URL);
};
</script>

<style lang="scss" scoped>
.bd-tab {
  display: flex;
  box-shadow: 0 1px 2px #00152914;
}
.bd-tab-container {
  display: flex;
  align-items: flex-end;
  .bd-tab-item {
    position: relative;
    height: 36px;
    line-height: 36px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-width: 100px;
    padding: 0 24px;
    margin-right: -18px;
    box-sizing: content-box;
    border-radius: 4px;

    &:last-child {
      margin-right: 0;
    }

    .text {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 82px;
      font-size: 14px;
    }

    .bd-tab-item-colse {
      border-radius: 50%;
      font-size: 16px;
      display: inline-flex;
      position: relative;
      height: 16px;
      width: 16px;
      justify-content: center;
      align-items: center;
      &:hover {
        font-size: 14px;
        color: #fff;
        background-color: #9ca3af;
      }
    }

    .chrome-tab__bg {
      position: absolute;
      height: 100%;
      width: 100%;
      pointer-events: none;
      left: 0;
      top: 0;
      z-index: -1;
    }
    .chrome-tab-divider {
      --un-bg-opacity: 1;
      background-color: rgba(31, 34, 37, var(--un-bg-opacity));
      position: absolute;
      height: 16px;
      width: 1px;
      right: 8px;
    }

    &:hover {
      z-index: 9;
      .chrome-tab__bg {
        color: #dee1e6;
      }
      .chrome-tab-divider {
        opacity: 0;
      }
    }
  }
  .chrome-tab_active {
    z-index: 10;
    color: var(--el-color-primary);
    background: var(--el-color-primary-light-9);
    outline: none;
    -webkit-mask: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANoAAAAkBAMAAAAdqzmBAAAAMFBMVEVHcEwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlTPQ5AAAAD3RSTlMAr3DvEM8wgCBA379gj5//tJBPAAAAnUlEQVRIx2NgAAM27fj/tAO/xBsYkIHyf9qCT8iWMf6nNQhAsk2f5rYheY7Dnua2/U+A28ZEe8v+F9Ax2v7/F4DbxkUH2wzgtvHTwbYPo7aN2jZq26hto7aN2jZq25Cy7Qvctnw62PYNbls9HWz7S8/G6//PsI6H4396gAUQy1je08W2jxDbpv6nD4gB2uWp+J9eYPsEhv/0BPS1DQBvoBLVZ3BppgAAAABJRU5ErkJggg==);
    mask: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANoAAAAkBAMAAAAdqzmBAAAAMFBMVEVHcEwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlTPQ5AAAAD3RSTlMAr3DvEM8wgCBA379gj5//tJBPAAAAnUlEQVRIx2NgAAM27fj/tAO/xBsYkIHyf9qCT8iWMf6nNQhAsk2f5rYheY7Dnua2/U+A28ZEe8v+F9Ax2v7/F4DbxkUH2wzgtvHTwbYPo7aN2jZq26hto7aN2jZq25Cy7Qvctnw62PYNbls9HWz7S8/G6//PsI6H4396gAUQy1je08W2jxDbpv6nD4gB2uWp+J9eYPsEhv/0BPS1DQBvoBLVZ3BppgAAAABJRU5ErkJggg==);
    -webkit-mask-size: 100% 100%;
    mask-size: 100% 100%;
    .chrome-tab__bg {
      color: var(--el-menu-active-bg-color);
    }

    .chrome-tab-divider {
      opacity: 0;
    }

    &:hover {
      color: var(--el-color-primary);
      background: var(--el-color-primary-light-9);
      outline: none;
      -webkit-mask: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANoAAAAkBAMAAAAdqzmBAAAAMFBMVEVHcEwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlTPQ5AAAAD3RSTlMAr3DvEM8wgCBA379gj5//tJBPAAAAnUlEQVRIx2NgAAM27fj/tAO/xBsYkIHyf9qCT8iWMf6nNQhAsk2f5rYheY7Dnua2/U+A28ZEe8v+F9Ax2v7/F4DbxkUH2wzgtvHTwbYPo7aN2jZq26hto7aN2jZq25Cy7Qvctnw62PYNbls9HWz7S8/G6//PsI6H4396gAUQy1je08W2jxDbpv6nD4gB2uWp+J9eYPsEhv/0BPS1DQBvoBLVZ3BppgAAAABJRU5ErkJggg==);
      mask: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANoAAAAkBAMAAAAdqzmBAAAAMFBMVEVHcEwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlTPQ5AAAAD3RSTlMAr3DvEM8wgCBA379gj5//tJBPAAAAnUlEQVRIx2NgAAM27fj/tAO/xBsYkIHyf9qCT8iWMf6nNQhAsk2f5rYheY7Dnua2/U+A28ZEe8v+F9Ax2v7/F4DbxkUH2wzgtvHTwbYPo7aN2jZq26hto7aN2jZq25Cy7Qvctnw62PYNbls9HWz7S8/G6//PsI6H4396gAUQy1je08W2jxDbpv6nD4gB2uWp+J9eYPsEhv/0BPS1DQBvoBLVZ3BppgAAAABJRU5ErkJggg==);
      -webkit-mask-size: 100% 100%;
      mask-size: 100% 100%;
      .chrome-tab__bg {
        color: var(--el-menu-active-bg-color);
      }
    }

    .bd-tab-item-colse {
      &:hover {
        background-color: $primary-color;
      }
    }
  }
}
// 暗黑模式
.dark {
  .bd-tab-container {
    .bd-tab-item {
      .chrome-tab-divider {
        background-color: #ffffffe6;
      }

      &:hover {
        .chrome-tab__bg {
          color: #333;
        }
      }
    }
  }

  .chrome-tab_active {
    .chrome-tab__bg {
      color: #072b4d;
    }

    &:hover {
      .chrome-tab__bg {
        color: #072b4d;
      }
    }
  }
}
</style>
