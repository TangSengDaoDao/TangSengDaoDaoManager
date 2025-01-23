<script lang="tsx" setup>
// API 接口
import { adminList, adminDelete } from '@/api/user';

import { ElButton, ElSpace, ElAvatar, ElMessage, ElMessageBox } from 'element-plus';
import AdminAdd from './components/AdminAdd.vue';
import { BU_DOU_CONFIG } from '@/config';
/**
 * 表格
 */
const column = reactive<Column.ColumnOptions[]>([
  {
    prop: 'avatar',
    label: '头像',
    align: 'center',
    width: 80,
    render: (scope: any) => {
      let img_url = '';
      if (scope.row['uid']) {
        img_url = `${BU_DOU_CONFIG.APP_URL}users/${scope.row['uid']}/avatar`;
      }
      return (
        <ElAvatar src={img_url} size={54}>
          {scope.row['name']}
        </ElAvatar>
      );
    }
  },
  {
    prop: 'uid',
    label: '用户ID'
  },
  {
    prop: 'name',
    label: '昵称'
  },
  {
    prop: 'username',
    label: '用户'
  },
  {
    prop: 'register_time',
    label: '注册时间'
  },
  {
    prop: 'operation',
    label: '操作',
    align: 'center',
    fixed: 'right',
    width: 100,
    render: (scope: any) => {
      return (
        <ElSpace>
          <ElButton type="danger" onClick={() => onAdminDelete(scope.row)}>
            删除
          </ElButton>
        </ElSpace>
      );
    }
  }
]);
const loadTable = ref(false);
const tableData = ref([]);

const getTableList = () => {
  loadTable.value = true;
  adminList().then((res: any) => {
    loadTable.value = false;
    tableData.value = res;
  });
};
// 刷新表格
const onRefreshTable = () => {
  getTableList();
};

// 管理员-新增
const adminAddValue = ref(false);

// 管理员-删除
const onAdminDelete = (item: any) => {
  ElMessageBox.confirm(`确定要删除管理员${item.name} 吗`, `删除管理员`, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    closeOnClickModal: false,
    type: 'warning'
  })
    .then(() => {
      const param = {
        uid: item.uid
      };
      adminDelete(param)
        .then((_res: any) => {
          getTableList();
          ElMessage({
            type: 'success',
            message: `删除管理成功！`
          });
        })
        .catch(err => {
          if (err.status == 400) {
            ElMessage.error(err.msg);
          }
        });
    })
    .catch(() => {
      console.log('取消');
    });
};

onMounted(() => {
  getTableList();
});
</script>

<template>
  <bd-page class="flex-col">
    <div class="flex-1 el-card border-none flex-col box-border overflow-hidden">
      <div class="h-50px pl-12px pr-12px box-border flex items-center justify-between bd-title">
        <div class="bd-title-left">
          <p class="m-0 font-600">管理员</p>
        </div>
        <div class="flex items-center h-50px">
          <el-form inline>
            <el-form-item class="mb-0 !mr-0">
              <el-button type="primary" @click="adminAddValue = true">新增管理员</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <div class="flex-1 overflow-hidden p-12px">
        <el-table v-loading="loadTable" :data="tableData" :border="true" style="width: 100%; height: 100%">
          <el-table-column type="index" :width="42" :align="'center'" :fixed="'left'">
            <template #header>
              <i-bd-setting class="cursor-pointer" size="16" />
            </template>
          </el-table-column>
          <el-table-column v-for="item in column" v-bind="item" :key="item.prop">
            <template #default="scope">
              <template v-if="item.render">
                <component :is="item.render" :row="scope.row"> </component>
              </template>
              <template v-else-if="item.formatter">
                <slot :name="item.prop" :row="scope.row">{{ item.formatter(scope.row) }}</slot>
              </template>
              <template v-else-if="item.prop">
                <slot :name="item.prop" :row="scope.row">{{ scope.row[item.prop!] }}</slot>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 新增管理员 -->
    <AdminAdd v-model:value="adminAddValue" @ok="onRefreshTable" />
  </bd-page>
</template>

<style lang="scss" scoped>
// 样式
.bd-title {
  border-bottom: 1px solid var(--el-card-border-color);
}
</style>

<route lang="yaml">
meta:
  title: 管理员
  isAffix: false
</route>
