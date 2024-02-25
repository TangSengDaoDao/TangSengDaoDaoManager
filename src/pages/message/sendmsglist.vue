<template>
  <bd-page class="flex-col">
    <!-- 布局 -->
    <div class="flex-1 el-card border-none flex-col box-border overflow-hidden">
      <div class="h-50px pl-12px pr-12px box-border flex items-center justify-between bd-title">
        <div class="bd-title-left">
          <p class="m-0 font-600">消息记录</p>
        </div>
        <div class="flex items-center h-50px">
          <el-form inline>
            <el-form-item class="mb-0 !mr-0">
              <el-button type="primary" @click="onSand">发送消息</el-button>
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
              <template v-else>
                <slot :name="item.prop" :row="scope.row">{{ scope.row[item.prop!] }}</slot>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="bd-card-footer pl-12px pr-12px mb-12px flex items-center justify-between">
        <div></div>
        <el-pagination
          v-model:current-page="queryFrom.page_index"
          v-model:page-size="queryFrom.page_size"
          :page-sizes="[15, 20, 30, 50, 100]"
          :background="true"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="onSizeChange"
          @current-change="onCurrentChange"
        />
      </div>
    </div>
    <!-- 发送消息 -->
    <bd-sand-all-msg v-model:value="sandValue" @ok="okSand" />
  </bd-page>
</template>

<route lang="yaml">
meta:
  title: 消息记录
  isAffix: false
</route>

<script lang="tsx" setup>
import { ElButton, ElAvatar } from 'element-plus';
import { BU_DOU_CONFIG } from '@/config';
// API 接口
import { messageGet } from '@/api/message';
/**
 * 表格
 */
const column = reactive<Column.ColumnOptions[]>([
  {
    prop: 'sender_name',
    label: '发送者名字',
    fixed: 'left',
    width: 140
  },
  {
    prop: 'sender',
    label: '发送者ID',
    width: 120
  },
  {
    prop: 'sender_avatar',
    label: '发送者头像',
    align: 'center',
    width: 100,
    render: (scope: any) => {
      let img_url = '';
      if (scope.row['sender']) {
        img_url = `${BU_DOU_CONFIG.APP_URL}users/${scope.row['sender']}/avatar`;
      }
      return (
        <ElAvatar src={img_url} size={54}>
          {scope.row['sender_name']}
        </ElAvatar>
      );
    }
  },
  {
    prop: 'receiver',
    label: '接受者ID',
    width: 300
  },
  {
    prop: 'receiver_name',
    label: '接受者名字',
    width: 180
  },
  {
    prop: 'receiver_avatar',
    label: '接受者头像',
    align: 'center',
    width: 100,
    render: (scope: any) => {
      let img_url = '';
      if (scope.row['receiver']) {
        const msgURL = scope.row['receiver_channel_type'] == 1 ? 'users' : 'groups';
        img_url = `${BU_DOU_CONFIG.APP_URL}${msgURL}/${scope.row['receiver']}/avatar`;
      }
      return (
        <ElAvatar src={img_url} size={54}>
          {scope.row['receiver_name']}
        </ElAvatar>
      );
    }
  },
  {
    prop: 'register_time',
    label: '聊天类型',
    width: 90,
    formatter(row: any) {
      return row['receiver_channel_type'] === 1 ? '单聊' : '群聊';
    }
  },
  {
    prop: 'handler_uid',
    label: '操作者ID',
    width: 140
  },
  {
    prop: 'handler_name',
    label: '操作者名字',
    width: 120
  },
  {
    prop: 'handler_uid',
    label: '操作者头像',
    align: 'center',
    width: 100,
    render: (scope: any) => {
      let img_url = '';
      if (scope.row['handler_uid']) {
        img_url = `${BU_DOU_CONFIG.APP_URL}users/${scope.row['handler_uid']}/avatar`;
      }
      return (
        <ElAvatar src={img_url} size={54}>
          {scope.row['handler_name']}
        </ElAvatar>
      );
    }
  },
  {
    prop: 'content',
    label: '消息内容',
    width: 260
  },
  {
    prop: 'created_at',
    label: '消息发送时间',
    width: 170
  }
]);
const tableData = ref<any[]>([]);
const loadTable = ref<boolean>(false);
// 分页
const total = ref(0);

// 查询
const queryFrom = reactive({
  page_size: 15,
  page_index: 1
});

const getTableList = () => {
  loadTable.value = true;
  messageGet(queryFrom).then((res: any) => {
    loadTable.value = false;
    tableData.value = res.list;
    total.value = res.count;
  });
};

// 分页page-size
const onSizeChange = (size: number) => {
  queryFrom.page_size = size;
  getTableList();
};

// 分页page-size
const onCurrentChange = (current: number) => {
  queryFrom.page_index = current;
  getTableList();
};

// 发送消息
const sandValue = ref<boolean>(false);
const onSand = () => {
  sandValue.value = true;
};

// 确定发送消息
const okSand = () => {
  getTableList();
};
// 初始化
onMounted(() => {
  getTableList();
});
</script>

<style lang="scss" scoped>
// 样式
.bd-title {
  border-bottom: 1px solid var(--el-card-border-color);
}
</style>
