<template>
  <div class="fullscreen line-height-none cursor-pointer">
    <component :is="isFullscreen ? 'i-bd-off-screen-one' : 'i-bd-full-screen-one'" theme="outline" size="20" @click="toggle" />
  </div>
</template>

<script setup lang="ts">
import { useFullscreen } from '@vueuse/core';
const { toggle, isFullscreen } = useFullscreen();
</script>
