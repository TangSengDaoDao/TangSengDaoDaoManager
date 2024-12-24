<script lang="ts" name="Devices" setup>
import { messageUserDevices } from '@/api/message';

interface IProps {
  value: boolean;
  title?: string;
  uid?: string;
}
const props = withDefaults(defineProps<IProps>(), {
  value: false,
  title: '查看设备',
  uid: ''
});

const emits = defineEmits<{
  (e: 'update:value', item: boolean): void;
}>();

watch(
  () => props.value,
  val => {
    if (val) {
      getDevices();
    } else {
      tableData.value = [];
    }
  }
);

const loadTable = ref(false);
const tableData = ref([]);

const column = reactive<Column.ColumnOptions[]>([
  {
    prop: 'device_id',
    label: '设备ID',
    width: 200
  },
  {
    prop: 'device_model',
    label: '设备名称',
    width: 120
  },
  {
    prop: 'device_model',
    label: '设备型号',
    width: 120
  },
  {
    prop: 'last_login',
    label: '最后登录时间'
  }
]);

const getDevices = async () => {
  loadTable.value = true;
  const res = await messageUserDevices({ uid: props.uid });
  loadTable.value = false;
  tableData.value = res as any;
};

const onClose = () => {
  emits('update:value', false);
};
</script>

<template>
  <el-dialog
    :model-value="value"
    :width="680"
    :align-center="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :draggable="true"
    :z-index="99"
    :title="title"
    @close="onClose"
  >
    <div class="h-500px overflow-hidden">
      <el-table v-loading="loadTable" :data="tableData" :border="true" style="width: 100%; height: 100%">
        <el-table-column v-for="item in column" v-bind="item" :key="item.prop">
          <template #default="scope">
            <template v-if="item.render">
              <component :is="item.render" :row="scope.row"> </component>
            </template>
            <template v-else-if="item.formatter">
              <slot :name="item.prop" :row="scope.row">{{ item.formatter(scope.row) }}</slot>
            </template>
            <template v-else>
              <slot :name="item.prop" :row="scope.row">{{ scope.row[item.prop!] }}</slot>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-dialog>
</template>
