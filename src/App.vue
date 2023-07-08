<template>
  <el-config-provider :locale="locale" :size="assemblySize" :button="buttonConfig">
    <router-view></router-view>
  </el-config-provider>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { getBrowserLang } from '@/utils';
import { useGlobalStore } from '@/stores/modules/global';
import en from 'element-plus/es/locale/lang/en';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import { LanguageType } from '@/stores/interface';
import { useTheme } from '@/hooks/useTheme';

const globalStore = useGlobalStore();

// init theme
const { initTheme } = useTheme();
initTheme();

const i18n = useI18n();
onMounted(() => {
  const language = globalStore.language ?? getBrowserLang();
  i18n.locale.value = language;
  globalStore.setGlobalState('language', language as LanguageType);
});

const locale = computed(() => {
  if (globalStore.language == 'zh') return zhCn;
  if (globalStore.language == 'en') return en;
  return getBrowserLang() == 'zh' ? zhCn : en;
});

const assemblySize = computed(() => globalStore.assemblySize);

const buttonConfig = reactive({ autoInsertSpace: false });
</script>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
