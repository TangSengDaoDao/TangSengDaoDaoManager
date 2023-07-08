<template>
  <el-drawer v-model="drawerVisible" title="主题配置" size="300px">
    <!-- 布局切换 -->
    <el-divider class="divider" content-position="center">
      <el-icon><Notification /></el-icon>
      布局切换
    </el-divider>
    <div class="layout-box">
      <el-tooltip effect="dark" content="纵向" placement="top" :show-after="200">
        <div :class="['layout-item layout-vertical', { 'is-active': layout == 'vertical' }]" @click="setLayout('vertical')">
          <div class="layout-dark"></div>
          <div class="layout-container">
            <div class="layout-light"></div>
            <div class="layout-content"></div>
          </div>
          <el-icon v-if="layout == 'vertical'"><CircleCheckFilled /></el-icon>
        </div>
      </el-tooltip>
      <el-tooltip effect="dark" content="经典" placement="top" :show-after="200">
        <div :class="['layout-item layout-classic', { 'is-active': layout == 'classic' }]" @click="setLayout('classic')">
          <div class="layout-dark"></div>
          <div class="layout-container">
            <div class="layout-light"></div>
            <div class="layout-content"></div>
          </div>
          <el-icon v-if="layout == 'classic'"><CircleCheckFilled /></el-icon>
        </div>
      </el-tooltip>
      <el-tooltip effect="dark" content="横向" placement="top" :show-after="200">
        <div :class="['layout-item layout-transverse', { 'is-active': layout == 'transverse' }]" @click="setLayout('transverse')">
          <div class="layout-dark"></div>
          <div class="layout-content"></div>
          <el-icon v-if="layout == 'transverse'"><CircleCheckFilled /></el-icon>
        </div>
      </el-tooltip>
      <el-tooltip effect="dark" content="分栏" placement="top" :show-after="200">
        <div :class="['layout-item layout-columns', { 'is-active': layout == 'columns' }]" @click="setLayout('columns')">
          <div class="layout-dark"></div>
          <div class="layout-light"></div>
          <div class="layout-content"></div>
          <el-icon v-if="layout == 'columns'"><CircleCheckFilled /></el-icon>
        </div>
      </el-tooltip>
    </div>

    <!-- 主题模式 -->
    <el-divider class="divider" content-position="center">
      <el-icon><ColdDrink /></el-icon>
      主题模式
    </el-divider>
    <div class="theme-item !justify-center">
      <ColorPicker
        :theme="globalStore.isDark ? 'dark' : 'light'"
        :color="primary"
        :colors-default="colorList"
        :sucker-hide="true"
        @change-color="changePrimary"
      />
    </div>
    <div class="theme-item">
      <span>暗黑模式</span>
      <SwitchDark />
    </div>
    <div class="theme-item">
      <span>灰色模式</span>
      <el-switch v-model="isGrey" @change="changeGreyOrWeak('grey', !!$event)" />
    </div>
    <div class="theme-item">
      <span>色弱模式</span>
      <el-switch v-model="isWeak" @change="changeGreyOrWeak('weak', !!$event)" />
    </div>
    <div class="theme-item mb40">
      <span>
        侧边栏反转色
        <el-tooltip effect="dark" content="该属性目前只在纵向布局模式下生效" placement="top">
          <el-icon><QuestionFilled /></el-icon>
        </el-tooltip>
      </span>
      <el-switch v-model="asideInverted" :disabled="layout !== 'vertical'" @change="setAsideTheme" />
    </div>

    <!-- 界面设置 -->
    <el-divider class="divider" content-position="center">
      <el-icon><Setting /></el-icon>
      界面设置
    </el-divider>
    <div class="theme-item">
      <span>折叠菜单</span>
      <el-switch v-model="isCollapse" />
    </div>
    <div class="theme-item">
      <span>面包屑</span>
      <el-switch v-model="breadcrumb" />
    </div>
    <div class="theme-item">
      <span>面包屑图标</span>
      <el-switch v-model="breadcrumbIcon" />
    </div>
    <div class="theme-item">
      <span>标签栏</span>
      <el-switch v-model="tabs" />
    </div>
    <div class="theme-item">
      <span>标签栏图标</span>
      <el-switch v-model="tabsIcon" />
    </div>
    <div class="theme-item">
      <span>页脚</span>
      <el-switch v-model="footer" />
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useTheme } from '@/hooks/useTheme';
import { useGlobalStore } from '@/stores/modules/global';
import { LayoutType } from '@/stores/interface';
import { DEFAULT_PRIMARY } from '@/config';
import mittBus from '@/utils/mittBus';
import SwitchDark from '@/components/SwitchDark/index.vue';
import { ColorPicker } from 'vue-color-kit';
import 'vue-color-kit/dist/vue-color-kit.css';

const { changePrimary, changeGreyOrWeak, setAsideTheme } = useTheme();

const globalStore = useGlobalStore();
const { layout, primary, isGrey, isWeak, asideInverted, isCollapse, breadcrumb, breadcrumbIcon, tabs, tabsIcon, footer } =
  storeToRefs(globalStore);

// 预定义主题颜色
const colorList = [
  DEFAULT_PRIMARY,
  '#daa96e',
  '#0c819f',
  '#409eff',
  '#27ae60',
  '#ff5c93',
  '#e74c3c',
  '#fd726d',
  '#f39c12',
  '#9b59b6',
  '#5D61FF',
  '#FF89CF',
  '#FC3CAD',
  '#BF3DCE',
  '#8E00A7',
  'rgba(0,0,0,0)'
];

// 设置布局方式
const setLayout = (val: LayoutType) => {
  globalStore.setGlobalState('layout', val);
  setAsideTheme();
};

// 打开主题设置
const drawerVisible = ref(false);
mittBus.on('openThemeDrawer', () => (drawerVisible.value = true));
</script>

<style scoped lang="scss">
.divider {
  margin-top: 15px;
  .el-icon {
    position: relative;
    top: 2px;
    right: 5px;
    font-size: 15px;
  }
}
.theme-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 14px 0;
  span {
    display: flex;
    align-items: center;
    font-size: 14px;
    .el-icon {
      margin-left: 3px;
      font-size: 15px;
      color: var(--el-text-color-regular);
      cursor: pointer;
    }
  }
}
.layout-box {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  padding: 10px 0 0;
  .layout-item {
    position: relative;
    box-sizing: border-box;
    width: 98px;
    height: 68px;
    padding: 6px;
    margin-bottom: 20px;
    cursor: pointer;
    border-radius: 5px;
    box-shadow: 0 0 5px 1px var(--el-border-color-lighter);
    transition: all 0.2s;
    .layout-dark {
      background-color: var(--el-color-primary);
      border-radius: 3px;
    }
    .layout-light {
      background-color: var(--el-color-primary-light-5);
      border-radius: 3px;
    }
    .layout-content {
      background-color: var(--el-color-primary-light-8);
      border: 1px dashed var(--el-color-primary);
      border-radius: 3px;
    }
    .el-icon {
      position: absolute;
      right: 10px;
      bottom: 10px;
      color: var(--el-color-primary);
      transition: all 0.2s;
    }
    &:hover {
      box-shadow: 0 0 5px 1px var(--el-border-color-darker);
    }
  }
  .is-active {
    box-shadow: 0 0 0 2px var(--el-color-primary) !important;
  }
  .layout-vertical {
    display: flex;
    justify-content: space-between;
    .layout-dark {
      width: 20%;
    }
    .layout-container {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 72%;
      .layout-light {
        height: 20%;
      }
      .layout-content {
        height: 67%;
      }
    }
  }
  .layout-classic {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .layout-dark {
      height: 22%;
    }
    .layout-container {
      display: flex;
      justify-content: space-between;
      height: 70%;
      .layout-light {
        width: 20%;
      }
      .layout-content {
        width: 70%;
      }
    }
  }
  .layout-transverse {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .layout-dark {
      height: 20%;
    }
    .layout-content {
      height: 67%;
    }
  }
  .layout-columns {
    display: flex;
    justify-content: space-between;
    .layout-dark {
      width: 14%;
    }
    .layout-light {
      width: 17%;
    }
    .layout-content {
      width: 55%;
    }
  }
}
</style>
