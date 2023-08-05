<template>
  <div>
    <!-- 文本 -->
    <span v-if="msg.type == 1">
      {{ msg['content'] }}
    </span>
    <!-- 图片 -->
    <img v-else-if="msg.type == 2" class="h-220px" :src="`${url}${msg['url']}`" />
    <!-- GIF -->
    <img v-else-if="msg.type == 3" class="w-320px" :src="`${url}${msg['url']}`" />
    <!-- 语音 -->
    <audio v-else-if="msg.type == 4" :src="`${url}${msg['url']}`"></audio>
    <!-- 视频 -->
    <video v-else-if="msg.type == 5" controls :src="`${url}${msg['url']}`" class="w-25px h-200px"></video>
    <!-- 位置 -->
    <div v-else-if="msg.type == 6">
      <div>{{ msg['title'] }}</div>
      <div>{{ msg['address'] }}</div>
    </div>
    <!-- 名片 -->
    <div v-else-if="msg.type == 7">
      <div>名片UID：{{ msg['uid'] }}</div>
      <div>用户名：{{ msg['name'] }}</div>
    </div>
    <!-- 文件 -->
    <div v-else-if="msg.type == 8">
      <div>{{ msg['title'] }}</div>
      <div>{{ msg['address'] }}</div>
    </div>
    <!-- 红包 -->
    <div v-else-if="msg.type == 9">
      <div>红包编号：{{ msg['redpacket_no'] }}</div>
      <div>祝福语：{{ msg['blessing'] }}</div>
    </div>
    <!-- 转帐 -->
    <div v-else-if="msg.type == 10">
      <div>金额：¥{{ msg['amount'] }}</div>
      <div>备注：{{ msg['remark'] }}</div>
    </div>
    <!-- 合并转发 -->
    <span v-else-if="msg.type == 11"> [合并转发] </span>
    <!-- 动态表情 -->
    <div v-else-if="msg.type == 12">[动态表情]</div>
    <!-- 矢量emoji -->
    <span v-else-if="msg.type == 13"> [矢量emoji] </span>
    <!-- 矢量emoji -->
    <span v-else-if="msg.type == 1014"> [截屏消息] </span>
    <!-- 系统消息 -->
    <span v-else-if="msg.type >= 1000 && msg.type <= 2000"> [系统消息] </span>
    <!-- 未知消息类型 -->
    <span v-else> [未知消息类型] </span>
  </div>
</template>

<script lang="tsx" name="BdMsg" setup>
import { BU_DOU_CONFIG } from '@/config';
interface IProps {
  msg: any;
}
defineProps<IProps>();
const url = BU_DOU_CONFIG.APP_URL;
</script>
