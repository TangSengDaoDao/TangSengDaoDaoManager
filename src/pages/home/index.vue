<template>
  <bd-page class="!p-0">
    <grid-layout
      v-model:layout="layout"
      :is-draggable="settings"
      :is-resizable="settings"
      :col-num="12"
      :row-height="30"
      :vertical-compact="true"
      :use-css-transforms="true"
      :margin="[12, 12]"
    >
      <grid-item v-for="item in layout" :key="item.i" :x="item.x" :y="item.y" :w="item.w" :h="item.h" :i="item.i">
        <component :is="item.component" v-bind="item.props" />
      </grid-item>
    </grid-layout>
  </bd-page>
</template>

<route lang="yaml">
meta:
  title: 首页
  isAffix: true
</route>

<script lang="tsx" setup>
import dayjs from 'dayjs';
import Statistics from './components/Statistics.vue';
import AddUser from './components/AddUser.vue';
import AddGroup from './components/AddGroup.vue';

// API接口
import { statisticsCountnumGet } from '@/api/statistic';

const layout = ref<any[]>([
  {
    x: 0,
    y: 0,
    w: 3,
    h: 4,
    i: 'register_count',
    props: { title: '当日注册人数', value: 0, icon: 'i-bd-people' },
    component: (props: any) => {
      return <Statistics {...props} />;
    }
  },
  {
    x: 3,
    y: 0,
    w: 3,
    h: 4,
    i: 'group_create_count',
    props: { title: '当日新建群', value: 0, icon: 'i-bd-peoples-two' },
    component: (props: any) => {
      return <Statistics {...props} />;
    }
  },
  {
    x: 6,
    y: 0,
    w: 3,
    h: 4,
    i: 'user_total_count',
    props: { title: '当前总用户', value: 0, icon: 'i-bd-ranking' },
    component: (props: any) => {
      return <Statistics {...props} />;
    }
  },
  {
    x: 9,
    y: 0,
    w: 3,
    h: 4,
    i: 'group_total_count',
    props: { title: '当前总群数', value: 0, icon: 'i-bd-data-sheet' },
    component: (props: any) => {
      return <Statistics {...props} />;
    }
  },
  {
    x: 0,
    y: 1,
    w: 12,
    h: 12,
    i: '4',
    component: (props: any) => {
      return <AddUser {...props} />;
    }
  },
  {
    x: 4,
    y: 1,
    w: 12,
    h: 12,
    i: '5',
    component: (props: any) => {
      return <AddGroup {...props} />;
    }
  }
]);

const settings = ref(false);
const formData = reactive({
  date: ''
});
const getStatisticsCountnum = () => {
  statisticsCountnumGet(formData).then((res: any) => {
    for (const key in res) {
      layout.value.map(item => {
        if (item.i === key) {
          item.props.value = res[key];
        }
      });
    }
  });
};

onMounted(() => {
  formData.date = dayjs().format('YYYY-MM-DD');
  getStatisticsCountnum();
});
</script>

<style lang="scss" scoped>
.el-main {
  padding: 0 !important;
}
</style>
