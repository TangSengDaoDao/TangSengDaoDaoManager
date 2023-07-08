<template>
  <el-dropdown trigger="click" @command="setAssemblySize">
    <component :is="'i-bd-add-text'" theme="outline" size="20" class="cursor-pointer" />
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="item in assemblySizeList"
          :key="item.value"
          :command="item.value"
          :disabled="assemblySize === item.value"
        >
          {{ item.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { useGlobalStore } from '@/stores/modules/global';
import { AssemblySizeType } from '@/stores/interface';

const globalStore = useGlobalStore();
const assemblySize = computed(() => globalStore.assemblySize);

const assemblySizeList = [
  { label: '默认', value: 'default' },
  { label: '大型', value: 'large' },
  { label: '小型', value: 'small' }
];

const setAssemblySize = (item: AssemblySizeType) => {
  if (assemblySize.value === item) return;
  globalStore.setGlobalState('assemblySize', item);
};
</script>
