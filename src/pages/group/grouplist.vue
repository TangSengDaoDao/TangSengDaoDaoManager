<template>
  <div class="wh-full flex-col">
    <!-- 布局 -->
    <div class="flex-1 el-card border-none flex-col box-border overflow-hidden">
      <div class="h-50px pl-12px pr-12px box-border flex items-center justify-between bd-title">
        <div class="bd-title-left">
          <p class="m-0 font-600">群列表</p>
        </div>
        <div class="flex items-center h-50px">
          <el-form inline>
            <el-form-item class="mb-0 !mr-16px">
              <el-input v-model="queryFrom.keyword" placeholder="群名称/群编号" clearable />
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
                <slot :name="item.prop" :row="scope.row">{{ scope.row[item.prop] }}</slot>
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
  </div>
</template>

<route lang="yaml">
meta:
  title: 群列表
  isAffix: false
</route>

<script lang="tsx" setup>
import { ElButton, ElSpace, ElAvatar, ElDropdown, ElDropdownMenu, ElDropdownItem } from 'element-plus';
import { BU_DOU_CONFIG } from '@/config';
// API 接口
import { groupListGet } from '@/api/group';
/**
 * 表格
 */
const column = reactive<Column.ColumnOptions[]>([
  {
    prop: 'name',
    label: '群名称',
    fixed: 'left',
    width: 200
  },
  {
    prop: 'group_no',
    label: '群编号',
    fixed: 'left',
    width: 200
  },
  {
    prop: 'avatar',
    label: '群头像',
    align: 'center',
    width: 100,
    render: (scope: any) => {
      let img_url = '';
      if (scope.row['group_no']) {
        img_url = `${BU_DOU_CONFIG.APP_URL}groups/${scope.row['group_no']}/avatar`;
      }
      return (
        <ElAvatar src={img_url} size={54}>
          {scope.row['name']}
        </ElAvatar>
      );
    }
  },
  {
    prop: 'status',
    label: '群状态',
    width: 80,
    formatter(row: any) {
      return row.status === 1 ? '正常' : '封禁中';
    }
  },
  {
    prop: 'member_count',
    label: '群人数',
    width: 80
  },
  {
    prop: 'create_name',
    label: '群主名称'
  },
  {
    prop: 'creator',
    label: '群主ID'
  },
  {
    prop: 'create_at',
    label: '创建时间',
    width: 180
  },
  {
    prop: 'operation',
    label: '操作',
    align: 'center',
    fixed: 'right',
    width: 180,
    render: (scope: any) => {
      return (
        <ElSpace>
          <ElButton type="primary" onClick={() => aa(scope.row)}>
            发消息
          </ElButton>
          <ElDropdown
            v-slots={{
              default: () => <ElButton>更多</ElButton>,
              dropdown: () => {
                return (
                  <ElDropdownMenu>
                    <ElDropdownItem onClick={() => bb(scope.row)}>群成员</ElDropdownItem>
                    <ElDropdownItem>聊天记录</ElDropdownItem>
                    <ElDropdownItem>黑名单成员</ElDropdownItem>
                    <ElDropdownItem>{scope.row.forbidden === 1 ? '禁言中' : '禁言'}</ElDropdownItem>
                    <ElDropdownItem>{scope.row.status === 1 ? '封禁' : '解禁'}</ElDropdownItem>
                  </ElDropdownMenu>
                );
              }
            }}
          />
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
  groupListGet(queryFrom).then((res: any) => {
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

const aa = (a: any) => {
  console.log(a);
};

const bb = (a: any) => {
  console.log(a);
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
