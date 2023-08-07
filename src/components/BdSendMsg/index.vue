<template>
  <el-dialog
    :model-value="value"
    :width="600"
    :align-center="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :draggable="true"
    :z-index="99"
    title="发送信息"
    @close="onClose"
  >
    <div class="mb-20px">
      <el-divider content-position="left">接受者信息</el-divider>
      <div>接受者ID：{{ receiveder }}</div>
      <div>接受者名称：{{ receivederName }}</div>
      <el-divider content-position="left">发送者信息</el-divider>
      <div>发送者ID：{{ sender }}</div>
      <div>发送者名字：{{ senderName }}</div>
    </div>
    <div>
      <el-input v-model="content" :rows="6" type="textarea" placeholder="请输入内容" />
    </div>
    <el-button type="primary" size="large" :loading="loaging" class="m-t-20px !w-full" @click="onSend">发送</el-button>
  </el-dialog>
</template>

<script lang="ts" name="BdSandMsg" setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
// API 接口
import { messageSendPost } from '@/api/message';
interface IProps {
  value: boolean;
  receivederChannelType?: number;
  receiveder?: string;
  receivederName?: string;
  sender?: string;
  senderName?: string;
}
const props = withDefaults(defineProps<IProps>(), {
  value: false,
  receivederChannelType: 1,
  receiveder: '',
  receivederName: '',
  sender: '',
  senderName: ''
});

const content = ref('');
const loaging = ref<boolean>(false);

const emits = defineEmits<{
  (e: 'update:value', item: boolean): void;
}>();

watch(
  () => props.value,
  (n, _o) => {
    console.log(props.value);
    props.value = n;
  }
);

const onClose = () => {
  emits('update:value', false);
};

const onSend = () => {
  if (!content.value) {
    return ElMessage.info('请输入发送内容！');
  }
  const fromData = {
    sender: props.sender,
    sender_name: props.senderName,
    received_channel_id: props.receiveder,
    received_channel_type: props.receivederChannelType,
    content: content.value
  };
  loaging.value = true;
  messageSendPost(fromData)
    .then((res: any) => {
      loaging.value = false;
      if (res.status == 200) {
        ElMessage.success('发送成功！');
        content.value = '';
      }
    })
    .catch(err => {
      loaging.value = false;
      if (err.status == 400) {
        ElMessage.error(err.msg);
      }
    });
};
</script>
