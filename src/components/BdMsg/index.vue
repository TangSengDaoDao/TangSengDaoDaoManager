<template>
  <div>
    <!-- 文本 -->
    <span v-if="msg.type == 1">
      {{ msg['content'] }}
    </span>
    <!-- 图片 -->
    <img
      v-else-if="msg.type == 2"
      class="w-120px cursor-pointer"
      :src="`${url}${msg['url']}`"
      @click="previewPicture(`${url}${msg['url']}`, 'image')"
    />
    <!-- GIF -->
    <img
      v-else-if="msg.type == 3"
      class="w-120px cursor-pointer"
      :src="`${url}${msg['url']}`"
      @click="previewPicture(`${url}${msg['url']}`, 'image')"
    />
    <!-- 语音 -->
    <audio v-else-if="msg.type == 4" :src="`${url}${msg['url']}`"></audio>
    <!-- 视频 -->
    <video
      v-else-if="msg.type == 5"
      controls
      controlsList="nofullscreen nodownload noplaybackrate noremote footbar"
      disablePictureInPicture
      :src="`${url}${msg['url']}`"
      class="w-220px h-100px cursor-pointer"
      @click="previewPicture(`${url}${msg['url']}`, 'image')"
    ></video>
    <!-- 位置 -->
    <div v-else-if="msg.type == 6">
      <div>位置标题：{{ msg['title'] }}</div>
      <div>地址：{{ msg['address'] }}</div>
    </div>
    <!-- 名片 -->
    <div v-else-if="msg.type == 7">
      <div>名片UID：{{ msg['uid'] }}</div>
      <div>用户名：{{ msg['name'] }}</div>
    </div>
    <!-- 文件 -->
    <div v-else-if="msg.type == 8">
      <div>文件标题：{{ msg['title'] }}</div>
      <div>地址：{{ msg['address'] }}</div>
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
    <tgs-player
      v-else-if="msg.type == 12"
      :src="`${url}${msg['url']}`"
      :data-src="`${url}${msg['url']}`"
      autoplay
      loop
      mode="normal"
      style="width: 120px; height: 100px"
    ></tgs-player>
    <!-- 矢量emoji -->
    <template v-else-if="msg.type == 13">
      <tgs-player
        v-if="msg.type == 13 && msg['url']"
        :src="`${url}${msg['url']}`"
        :data-src="`${url}${msg['url']}`"
        autoplay
        loop
        mode="normal"
        style="width: 120px; height: 100px"
      ></tgs-player>
      <span v-else> {{ msg['content'] ? msg['content'] : `[矢量emoji]` }} </span>
    </template>
    <!-- 系统消息 -->
    <template v-else-if="msg.type >= 1000 && msg.type <= 2000">
      <span v-if="msg.type == 1014"> [截屏消息] </span>
      <span v-else> [系统消息] </span>
    </template>
    <!-- 未知消息类型 -->
    <span v-else> [未知消息类型] </span>
  </div>
</template>

<script lang="tsx" name="BdMsg" setup>
import { Fancybox } from '@fancyapps/ui';
import '@lottiefiles/lottie-player/dist/tgs-player';
import { BU_DOU_CONFIG } from '@/config';
interface IProps {
  msg: any;
}
defineProps<IProps>();
const url = BU_DOU_CONFIG.APP_URL;

// 图片预览
const previewPicture = (url: string, type: string) => {
  const imgList = [];
  imgList.push({ src: url, defaultType: type });
  Fancybox.show(imgList, {
    Toolbar: {
      display: {
        left: ['infobar'],
        middle: ['zoomIn', 'zoomOut', 'toggle1to1', 'rotateCCW', 'rotateCW', 'flipX', 'flipY'],
        right: ['slideshow', 'thumbs', 'close']
      }
    }
  });
};
</script>

<style scoped>
video::-webkit-media-controls-timeline {
  display: none;
}
video::-webkit-media-controls-mute-button {
  display: none;
}
video::-webkit-media-controls-toggle-closed-captions-button {
  display: none;
}
video::-webkit-media-controls-volume-slider {
  display: none;
}
video::-webkit-media-controls-fullscreen-button {
  display: none;
}
</style>
