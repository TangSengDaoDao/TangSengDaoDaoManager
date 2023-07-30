<template>
  <div class="bd-page">
    <slot />
  </div>
</template>
<script lang="ts" name="BdPage" setup></script>

<style lang="scss" scoped>
.bd-page {
  width: 100%;
  height: 100%;
  padding: 12px;
  box-sizing: border-box;
}
</style>
