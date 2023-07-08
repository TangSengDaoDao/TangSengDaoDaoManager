<template>
  <div class="theme-setting line-height-none cursor-pointer">
    <component :is="'i-bd-page-template'" theme="outline" size="20" @click="openDrawer" />
  </div>
</template>
<script setup lang="ts">
import mittBus from '@/utils/mittBus';
const openDrawer = () => {
  mittBus.emit('openThemeDrawer');
};
</script>
