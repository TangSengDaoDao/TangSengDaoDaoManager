<template>
  <bd-page class="flex-col">
    <!-- 布局 -->
    <div class="flex-1 el-card border-none flex-col box-border overflow-hidden">
      <div class="h-50px pl-12px pr-12px box-border flex items-center justify-between bd-title">
        <div class="bd-title-left">
          <p class="m-0 font-600">
            <el-text type="primary">{{ $route.query.name }}</el-text>
            群成员
          </p>
        </div>
        <div class="flex items-center h-50px">
          <el-form inline>
            <el-form-item class="mb-0 !mr-16px">
              <el-input v-model="queryFrom.keyword" placeholder="成员昵称" clearable />
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
              <template v-else-if="item.prop">
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
    <!-- 发消息 -->
    <bd-send-msg v-model:value="sendValue" v-bind="sendInfo" />
  </bd-page>
</template>

<route lang="yaml">
meta:
  title: 群成员
  isAffix: false
</route>

<script lang="tsx" setup>
import { useRoute } from 'vue-router';
import { ElButton, ElSpace, ElText, ElAvatar, ElMessage, ElMessageBox } from 'element-plus';
import { BU_DOU_CONFIG } from '@/config';
// API 接口
import { groupGroupmembersGet, groupGroupmembersDelete } from '@/api/group';

const route = useRoute();
/**
 * 表格
 */
const column = reactive<Column.ColumnOptions[]>([
  {
    prop: 'name',
    label: '用户昵称',
    fixed: 'left',
    width: 200
  },
  {
    prop: 'avatar',
    label: '用户头像',
    align: 'center',
    width: 100,
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
    label: '用户ID',
    fixed: 'left',
    width: 320
  },
  {
    prop: 'status',
    label: '成员角色',
    width: 120,
    render: (scope: any) => {
      let text = '成员';
      let type: any = 'primary';
      // 群主
      if (scope?.row['role'] == 1) {
        text = '群主';
        type = 'success';
      }
      // 管理员
      if (scope?.row['role'] == 2) {
        text = '管理员';
        type = 'warning';
      }
      return <ElText type={type}>{text}</ElText>;
    }
  },
  {
    prop: 'remark',
    label: '群内备注'
  },
  {
    prop: 'created_at',
    label: '入群时间',
    width: 180
  },
  {
    prop: 'operation',
    label: '操作',
    align: 'left',
    fixed: 'right',
    width: 180,
    render: (scope: any) => {
      return (
        <ElSpace>
          <ElButton type="primary" onClick={() => onSand(scope.row)}>
            发消息
          </ElButton>
          {scope?.row['role'] != 1 && (
            <ElButton type="danger" onClick={() => onDel(scope.row)}>
              移除
            </ElButton>
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
  page_size: 15,
  page_index: 1
});

const getUserList = () => {
  loadTable.value = true;
  groupGroupmembersGet(queryFrom, route.query.groupNo as string).then((res: any) => {
    loadTable.value = false;
    tableData.value = res.list;
    total.value = res.count;
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

// 发送信息
const sendValue = ref<boolean>(false);
const sendInfo = ref({
  receivederChannelType: 1,
  receiveder: '',
  receivederName: '',
  sender: '',
  senderName: ''
});
const onSand = (item: any) => {
  sendValue.value = true;
  sendInfo.value = {
    receivederChannelType: 2,
    receiveder: route.query.groupNo as string,
    receivederName: route.query.name as string,
    sender: item.uid,
    senderName: item.name
  };
};

const onGroupGroupmembersDelete = (item: any) => {
  const uid: string[] = [];
  uid.push(item.uid);
  const formData = {
    uid
  };
  groupGroupmembersDelete(formData, route.query.groupNo as string)
    .then((res: any) => {
      if (res.status == 200) {
        getUserList();
        ElMessage({
          type: 'success',
          message: '移除成功！'
        });
      }
    })
    .catch(err => {
      if (err.status == 400) {
        ElMessage.error(err.msg);
      }
    });
};

// 删除
const onDel = (item: any) => {
  ElMessageBox.confirm('确定，是否删除此移除?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    closeOnClickModal: false,
    type: 'warning'
  })
    .then(() => {
      onGroupGroupmembersDelete(item);
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
