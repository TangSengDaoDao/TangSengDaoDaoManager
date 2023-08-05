<template>
  <div class="el-card flex flex-col box-border h-full w-full relative">
    <div class="h-50px pl-12px pr-12px box-border flex items-center justify-between bd-title">
      <div class="bd-title-left">
        <p class="m-0 font-600">新建群数量统计</p>
      </div>
      <div class="bd-tittle-right">
        <el-date-picker
          v-model="dates"
          type="daterange"
          class="!w-220px"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :clearable="false"
          value-format="YYYY-MM-DD"
          @change="changeDatas"
        />
      </div>
    </div>
    <div class="flex-1 flex overflow-hidden p-12px">
      <div class="flex-1">
        <div ref="echartsRef" class="w-full h-full"></div>
      </div>
      <div class="w-400px">
        <div class="mb-12px font-600">新建群排名</div>
        <div class="panking">
          <template v-for="(item, index) in sortData" :key="index">
            <div v-if="index < 10" class="panking-item">
              <div class="index">{{ index + 1 }}</div>
              <div class="date flex-1">{{ item.time }}</div>
              <div class="num">{{ item.value }}</div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" name="AddGroup" setup>
import * as echarts from 'echarts';
import dayjs from 'dayjs';
// API 接口
import { statisticsCreatedgroupGet } from '@/api/statistic';

interface Iprops {
  title?: string;
  value?: number;
  icon?: string;
}
interface ISort {
  time: string;
  value: number;
}

defineProps<Iprops>();

let myChart: echarts.ECharts | null = null;
const echartsRef = ref<HTMLElement>();
const sortData = ref<ISort[]>([]);
const dates = ref<string[]>([]);

const option: any = reactive({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: [],
    axisLabel: {
      color: '#a1a1a1'
    }
  },
  yAxis: [
    {
      type: 'value',
      axisLabel: {
        color: '#a1a1a1'
      }
    }
  ],
  series: {
    name: '群数',
    type: 'bar',
    emphasis: {
      focus: 'series'
    },
    data: []
  }
});

const getStatisticsCreatedgroup = () => {
  statisticsCreatedgroupGet(dates.value[0], dates.value[1]).then((res: any) => {
    const sortList: ISort[] = [];
    const xAxisData = [];
    const seriesData = [];
    for (const key in res) {
      sortList.push({
        time: key,
        value: res[key]
      });
      xAxisData.push(key);
      seriesData.push(res[key]);
    }
    sortList.sort((a, b) => {
      return b.value - a.value;
    });
    sortData.value = sortList;
    option.xAxis.data = xAxisData;
    option.series.data = seriesData;
    myChart && myChart.setOption(option);
    myChart && myChart.resize();
    window.addEventListener('resize', echartsResize);
  });
};

// 日期切换
const changeDatas = (_data: string[]) => {
  getStatisticsCreatedgroup();
};

const echartsResize = () => {
  myChart && myChart.resize();
};

onMounted(() => {
  const start = dayjs(new Date().getTime() - 30 * 24 * 60 * 60 * 1000).format('YYYY-MM-DD');
  const end = dayjs().format('YYYY-MM-DD');
  dates.value = [start, end];
  myChart = echarts.init(echartsRef.value as HTMLElement);
  getStatisticsCreatedgroup();
});

// 防止 echarts 页面 keepAlive 时，还在继续监听页面
onDeactivated(() => {
  window.removeEventListener('resize', echartsResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', echartsResize);
});
</script>

<style lang="scss" scoped>
// 样式
.bd-title {
  border-bottom: 1px solid var(--el-card-border-color);
}

.panking {
  .panking-item {
    display: flex;
    justify-content: center;
    margin-bottom: 16px;

    :last-child {
      margin-bottom: 0;
    }

    .index {
      width: 20px;
      height: 20px;
      line-height: 20px;
      font-weight: 600;
      font-size: 12px;
      text-align: center;
      background-color: rgb(0, 80, 179);
      color: rgb(255, 255, 255);
      border-radius: 20px;
      margin-right: 12px;
    }
  }
}
</style>
