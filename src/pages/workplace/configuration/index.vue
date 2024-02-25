<template>
  <bd-page class="flex-col">
    <div class="flex-1 el-card border-none flex-col box-border overflow-hidden">
      <el-tabs v-model="activeName" class="bd-tabs">
        <el-tab-pane v-for="item in tabsData" :key="item.name" :label="item.label" :name="item.name">
          <component :is="item.render" v-if="item.name === activeName" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </bd-page>
</template>

<route lang="yaml">
meta:
  title: 工作台设置
  isAffix: false
</route>

<script lang="tsx" setup>
import Banner from './components/Banner.vue';
import CustomGroup from './components/CustomGroup.vue';

const activeName = ref('banner');

const tabsData = reactive([
  {
    name: 'banner',
    label: '轮播',
    render: () => {
      return <Banner />;
    }
  },
  {
    name: 'custom-group',
    label: '自定义分组',
    render: () => {
      return <CustomGroup />;
    }
  }
]);
</script>
