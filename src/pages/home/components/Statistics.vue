<template>
  <div class="el-card box-border p-12px h-full w-full relative">
    <div>{{ title }}</div>
    <count-to class="num" :start-val="0" :end-val="value" :duration="3000"></count-to>
    <div v-if="icon" class="right-icon">
      <component :is="icon" size="35" />
    </div>
  </div>
</template>

<script lang="ts" name="Statistics" setup>
import { CountTo } from 'vue3-count-to';
interface Iprops {
  title?: string;
  value?: number;
  icon?: string;
}
defineProps<Iprops>();
</script>

<style lang="scss" scoped>
.num {
  display: block;
  margin-block-start: 1em;
  margin-block-end: 1em;
  font-size: 28px;
}

.right-icon {
  position: absolute;
  top: 50%;
  right: 20px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--el-color-primary);
  background: var(--el-color-primary-light-9);
  border-radius: 50%;
  transform: translateY(-50%);
}
</style>
