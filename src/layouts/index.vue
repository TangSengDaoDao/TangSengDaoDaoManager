<template>
  <component :is="LayoutComponents[layout]" />
  <ThemeDrawer />
</template>

<script setup lang="ts" name="layout">
import { computed, type Component } from 'vue';
import { LayoutType } from '@/stores/interface';
import { useGlobalStore } from '@/stores/modules/global';

import ThemeDrawer from '@/layouts/components/ThemeDrawer.vue';
import LayoutVertical from '@/layouts/components/LayoutVertical.vue';
import LayoutClassic from '@/layouts/components/LayoutClassic.vue';
import LayoutTransverse from '@/layouts/components/LayoutTransverse.vue';
import LayoutColumns from '@/layouts/components/LayoutColumns.vue';

const LayoutComponents: Record<LayoutType, Component> = {
  vertical: LayoutVertical,
  classic: LayoutClassic,
  transverse: LayoutTransverse,
  columns: LayoutColumns
};
const globalStore = useGlobalStore();
const layout = computed(() => globalStore.layout);
</script>
