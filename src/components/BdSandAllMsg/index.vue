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
      <div>给所有用户发送一条信息</div>
    </div>
    <div>
      <el-input v-model="content" :rows="6" type="textarea" placeholder="请输入内容" />
    </div>
    <template #footer>
      <el-space>
        <el-button @click="onClose">取消</el-button>
        <el-button type="primary" :loading="loaging" @click="onSend">发送</el-button>
      </el-space>
    </template>
  </el-dialog>
</template>

<script lang="ts" name="BdSandAllMsg" setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
// API 接口
import { messageSendAllPost } from '@/api/message';
interface IProps {
  value: boolean;
}
const props = withDefaults(defineProps<IProps>(), {
  value: false
});

const content = ref('');
const loaging = ref<boolean>(false);

const emits = defineEmits<{
  (e: 'update:value', item: boolean): void;
  (e: 'ok', item: any): void;
}>();

watch(
  () => props.value,
  (n, _o) => {
    console.log(props.value);
    props.value = n;
  }
);
// 取消
const onClose = () => {
  emits('update:value', false);
};
// 发送
const onSend = () => {
  if (!content.value) {
    return ElMessage.info('请输入发送内容！');
  }
  const fromData = {
    content: content.value
  };
  loaging.value = true;
  messageSendAllPost(fromData)
    .then((res: any) => {
      loaging.value = false;
      if (res.status == 200) {
        ElMessage.success('发送成功！');
        content.value = '';
        onClose();
        emits('ok', true);
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
