<template>
  <bd-page class="flex-col">
    <!-- 布局 -->

    <div class="flex-1 el-card border-none flex-col box-border overflow-hidden">
      <div class="h-50px pl-12px pr-12px box-border flex items-center justify-between bd-title">
        <div class="bd-title-left">
          <p class="m-0 font-600">
            <el-text type="primary">{{ $route.query.name }}</el-text>
            和
            <el-text type="primary">{{ $route.query.toname }}</el-text>
            聊天记录
          </p>
        </div>
        <div class="flex items-center h-50px">
          <el-form inline>
            <el-form-item class="mb-0 !mr-16px">
              <el-input v-model="queryFrom.keyword" placeholder="发送者名字/消息内容" clearable />
            </el-form-item>
            <el-form-item class="mb-0 !mr-0">
              <el-button type="primary" @click="getUserList">查询</el-button>
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
  </bd-page>
</template>

<route lang="yaml">
meta:
  title: 聊天记录
  isAffix: false
</route>

<script lang="tsx" setup>
import { useRoute } from 'vue-router';
import { ElButton, ElSpace, ElAvatar, ElMessage, ElMessageBox } from 'element-plus';
import BdMsg from '@/components/BdMsg/index.vue';
import { BU_DOU_CONFIG } from '@/config';
// API 接口
import { messageRecordpersonalGet, messageDelete } from '@/api/message';

const route = useRoute();
/**
 * 表格
 */
const column = reactive<Column.ColumnOptions[]>([
  {
    prop: 'message_id',
    label: '消息编号',
    fixed: 'left',
    width: 140
  },
  {
    prop: 'sender_name',
    label: '发送者名字',
    width: 120
  },
  {
    prop: 'sender',
    label: '发送者ID',
    width: 140
  },
  {
    prop: 'avatar',
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
    prop: 'payload',
    label: '消息内容',
    minWidth: 300,
    render: (scope: any) => {
      if (scope.row['payload']) {
        const showContent = scope.row['payload'];
        // 是否加密
        if (scope.row['is_encrypt'] == 1) {
          return '[加密消息，无法查看]';
        } else {
          return <BdMsg msg={showContent} />;
        }
      }
    }
  },
  {
    prop: 'is_encrypt',
    label: '是否加密',
    width: 86,
    formatter(row: any) {
      return row.is_encrypt === 1 ? '是' : '否';
    }
  },
  {
    prop: 'revoke',
    label: '是否撤回',
    width: 120,
    formatter(row: any) {
      return row.revoke === 1 ? '是' : '否';
    }
  },
  {
    prop: 'is_deleted',
    label: '是否删除',
    width: 120,
    formatter(row: any) {
      return row.is_deleted === 1 ? '是' : '否';
    }
  },
  {
    prop: 'created_at',
    label: '发送时间',
    width: 170
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
          {scope.row['is_deleted'] == 0 ? (
            <ElButton type="danger" onClick={() => onDel(scope.row)}>
              删除
            </ElButton>
          ) : (
            ''
          )}
        </ElSpace>
      );
    }
  }
]);
const tableData = ref<any[]>([]);
const loadTable = ref<boolean>(false);
// 分页
const total = ref(0);

// 查询
const queryFrom = reactive({
  keyword: '',
  uid: route.query.uid,
  touid: route.query.touid,
  page_size: 15,
  page_index: 1
});

const getUserList = () => {
  loadTable.value = true;
  messageRecordpersonalGet(queryFrom).then((res: any) => {
    loadTable.value = false;
    tableData.value = res?.list ? res?.list : [];
    total.value = res?.count ? res?.count : 0;
  });
};

// 分页page-size
const onSizeChange = (size: number) => {
  queryFrom.page_size = size;
  getUserList();
};

// 分页page-size
const onCurrentChange = (current: number) => {
  queryFrom.page_index = current;
  getUserList();
};

// 删除消息
const msgDel = (data: any) => {
  const list: any[] = [];
  list.push({
    message_id: data.message_id,
    message_seq: data.message_seq
  });
  const formData = {
    channel_id: route.query.uid,
    channel_type: 1,
    from_uid: route.query.touid,
    list
  };
  messageDelete(formData).then((res: any) => {
    if (res.status == 200) {
      getUserList();
      ElMessage({
        type: 'success',
        message: '删除成功！'
      });
    }
  });
};

// 删除
const onDel = (item: any) => {
  ElMessageBox.confirm('确定，是否删除此消息?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    closeOnClickModal: false,
    type: 'warning'
  })
    .then(() => {
      msgDel(item);
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消成功！'
      });
    });
};

// 初始化
onMounted(() => {
  getUserList();
});
</script>

<style lang="scss" scoped>
// 样式
.bd-title {
  border-bottom: 1px solid var(--el-card-border-color);
}
</style>
