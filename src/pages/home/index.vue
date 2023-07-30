<template>
  <bd-page class="!p-0">
    <grid-layout
      v-model:layout="layout"
      :is-draggable="settings"
      :is-resizable="settings"
      :col-num="12"
      :row-height="30"
      :vertical-compact="true"
      :use-css-transforms="true"
      :margin="[12, 12]"
    >
      <grid-item v-for="item in layout" :key="item.i" :x="item.x" :y="item.y" :w="item.w" :h="item.h" :i="item.i">
        <component :is="item.render" />
      </grid-item>
    </grid-layout>
  </bd-page>
</template>

<route lang="yaml">
meta:
  title: 首页
  isAffix: true
</route>

<script lang="tsx" setup>
import Statistics from './components/Statistics.vue';

const layout = ref([
  { x: 0, y: 0, w: 3, h: 4, i: '0', render: Statistics },
  { x: 3, y: 0, w: 3, h: 4, i: '1', render: Statistics },
  { x: 6, y: 0, w: 3, h: 4, i: '2', render: Statistics },
  { x: 9, y: 0, w: 3, h: 4, i: '3', render: Statistics },
  { x: 0, y: 1, w: 12, h: 12, i: '4', render: Statistics },
  { x: 4, y: 1, w: 12, h: 12, i: '5', render: Statistics }
]);

const settings = ref(false);
</script>

<style lang="scss" scoped>
.el-main {
  padding: 0 !important;
}
</style>
