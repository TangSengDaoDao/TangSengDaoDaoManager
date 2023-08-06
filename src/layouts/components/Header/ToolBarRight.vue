<template>
  <div class="tool-bar-ri">
    <div class="header-icon">
      <AssemblySize id="assemblySize" />
      <Language id="language" />
      <Fullscreen id="fullscreen" />
      <ThemeSetting id="themeSetting" />
    </div>
    <Avatar id="avatar" />
  </div>
</template>

<script setup lang="ts">
import AssemblySize from './components/AssemblySize.vue';
import Language from './components/Language.vue';
import ThemeSetting from './components/ThemeSetting.vue';
import Fullscreen from './components/Fullscreen.vue';
import Avatar from './components/Avatar.vue';
</script>
<style scoped lang="scss">
.tool-bar-ri {
  display: flex;
  align-items: center;
  justify-content: center;
  .header-icon {
    display: flex;
    align-items: center;
    & > * {
      color: var(--el-text-color-primary) !important;
      margin-left: 20px;
    }
  }
}
</style>
