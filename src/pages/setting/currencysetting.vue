<template>
  <bd-page class="flex-col">
    <!-- S 页面布局 -->
    <div class="flex-1 el-card border-none flex-col box-border overflow-hidden">
      <!-- S 标题 -->
      <div class="h-50px pl-12px pr-12px box-border flex items-center justify-between bd-title">
        <div class="bd-title-left">
          <p class="m-0 font-600">通用设置</p>
        </div>
        <div class="flex items-center h-50px"></div>
      </div>
      <!-- E 标题 -->

      <!-- S 内容 -->
      <div class="flex-1 overflow-hidden p-12px">
        <div class="h-full overflow-auto">
          <div class="w-540px">
            <el-form :model="formData" label-width="160px">
              <el-form-item label="手机号搜索：">
                <el-radio-group v-model="formData.search_by_phone">
                  <el-radio :label="1">开启</el-radio>
                  <el-radio :label="0">关闭</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="注册邀请：">
                <el-radio-group v-model="formData.register_invite_on">
                  <el-radio :label="1">开启</el-radio>
                  <el-radio :label="0">关闭</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="系统账号加入群聊：">
                <el-radio-group v-model="formData.invite_system_account_join_group_on">
                  <el-radio :label="1">开启</el-radio>
                  <el-radio :label="0">关闭</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="用户默认加入群聊：">
                <el-radio-group v-model="formData.new_user_join_system_group">
                  <el-radio :label="1">加入</el-radio>
                  <el-radio :label="0">不加入</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="新用户需完善资料：">
                <el-radio-group v-model="formData.register_user_must_complete_info_on">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="消息可撤回时长：">
                <el-select v-model="formData.revoke_second" class="!w-100%">
                  <el-option label="1分钟" :value="60" />
                  <el-option label="2分钟" :value="120" />
                  <el-option label="3分钟" :value="180" />
                  <el-option label="4分钟" :value="240" />
                  <el-option label="5分钟" :value="300" />
                  <el-option label="永久" :value="-1" />
                </el-select>
              </el-form-item>
              <el-form-item label="注册登录发送欢迎语：">
                <el-radio-group v-model="formData.send_welcome_message_on">
                  <el-radio :label="1">开启</el-radio>
                  <el-radio :label="0">关闭</el-radio>
                </el-radio-group>
              </el-form-item>
              <template v-if="formData.send_welcome_message_on === 1">
                <el-form-item label="登录欢迎语：">
                  <el-input
                    v-model="formData.welcome_message"
                    :autosize="{ minRows: 14, maxRows: 16 }"
                    type="textarea"
                    maxlength="1000"
                    show-word-limit
                  />
                </el-form-item>
              </template>
              <el-form-item>
                <el-button :loading="loginButLoading" class="!w-100%" type="primary" @click="onSaveClick">保存</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
      <!-- E 内容 -->
    </div>
    <!-- E 页面布局 -->
  </bd-page>
</template>

<route lang="yaml">
meta:
title: 通用设置
</route>

<script lang="ts" setup>
import { ElMessage } from 'element-plus';
// API 接口
import { getAppconfigGet, updateAppconfigPost } from '@/api/setting';
// 表单
const formData = reactive({
  welcome_message: '欢迎你来到悟空聊天。',
  revoke_second: 60,
  new_user_join_system_group: 1,
  search_by_phone: 1,
  send_welcome_message_on: 1,
  register_invite_on: 1,
  invite_system_account_join_group_on: 1,
  register_user_must_complete_info_on: 0
});
//  初始化数据
const initData = () => {
  getAppconfigGet().then((res: any) => {
    formData.welcome_message = res.welcome_message;
    formData.revoke_second = res.revoke_second;
    formData.new_user_join_system_group = res.new_user_join_system_group;
    formData.search_by_phone = res.search_by_phone;
    formData.send_welcome_message_on = res.send_welcome_message_on;
    formData.register_invite_on = res.register_invite_on;
    formData.invite_system_account_join_group_on = res.invite_system_account_join_group_on;
    formData.register_user_must_complete_info_on = res.register_user_must_complete_info_on;
  });
};

// 更新通用设置
const loginButLoading = ref(false);
const onSaveClick = () => {
  loginButLoading.value = true;
  updateAppconfigPost(formData)
    .then((_res: any) => {
      loginButLoading.value = false;
      ElMessage.success('更新成功');
    })
    .catch(err => {
      loginButLoading.value = false;
      if (err.status == 400) {
        ElMessage.error(err.msg);
      }
    });
};

onMounted(() => {
  initData();
});
</script>

<style lang="scss" scoped>
.bd-title {
  border-bottom: 1px solid var(--el-card-border-color);
}
</style>
