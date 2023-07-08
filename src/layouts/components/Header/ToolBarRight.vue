<template>
  <div class="tool-bar-ri">
    <div class="header-icon">
      <AssemblySize id="assemblySize" />
      <Language id="language" />
      <ThemeSetting id="themeSetting" />
      <Fullscreen id="fullscreen" />
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
      margin-left: 20px;
    }
  }
}
</style>
