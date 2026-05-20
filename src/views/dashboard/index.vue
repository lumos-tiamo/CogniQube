<template>
  <div class="dashboard-page">
    <div class="kpi-section">
      <el-row :gutter="20">
        <el-col :span="6">
          <kpi-card
            icon="ChatDotSquare"
            label="今日质检会话数"
            :value="1250"
            color="#409eff"
            :trend="5.2"
          />
        </el-col>
        <el-col :span="6">
          <kpi-card
            icon="Star"
            label="平均得分"
            :value="82.5"
            color="#67c23a"
            :trend="2.1"
          />
        </el-col>
        <el-col :span="6">
          <kpi-card
            icon="Warning"
            label="不合格率"
            :value="`12.0%`"
            color="#f56c6c"
            :trend="-1.5"
          />
        </el-col>
        <el-col :span="6">
          <kpi-card
            icon="MagicStick"
            label="AI标记数"
            :value="156"
            color="#e6a23c"
            :trend="8.3"
          />
        </el-col>
      </el-row>
    </div>

    <el-row :gutter="20" class="chart-section">
      <el-col :span="16">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>满意度趋势</span>
              <el-radio-group v-model="trendType" size="small">
                <el-radio-button label="day">按天</el-radio-button>
                <el-radio-button label="week">按周</el-radio-button>
                <el-radio-button label="month">按月</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <base-chart :option="trendChartOption" height="350px" />
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card>
          <template #header>
            <span>问题分类统计</span>
          </template>
          <base-chart :option="pieChartOption" height="350px" />
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="chart-section">
      <el-col :span="24">
        <el-card>
          <template #header>
            <span>地区满意度分布</span>
          </template>
          <base-chart :option="barChartOption" height="400px" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import KPICard from '@/components/common/KPICard.vue'
import BaseChart from '@/components/charts/BaseChart.vue'
import type { EChartsOption } from 'echarts'

const trendType = ref<'day' | 'week' | 'month'>('day')

// 生成不同时间维度的数据
const generateTrendData = (type: 'day' | 'week' | 'month') => {
  const count = type === 'day' ? 30 : type === 'week' ? 12 : 12
  return Array.from({ length: count }, (_, i) => ({
    date: new Date(Date.now() - (count - 1 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    score: 3.5 + Math.random() * 1.5,
  }))
}

const trendData = computed(() => generateTrendData(trendType.value))

const issueCategories = [
  { name: '响应慢', value: 45 },
  { name: '态度差', value: 32 },
  { name: '答非所问', value: 38 },
  { name: '专业性不足', value: 41 },
]

const regionData = [
  { name: '北京', value: 4.2 },
  { name: '上海', value: 4.5 },
  { name: '广州', value: 4.1 },
  { name: '深圳', value: 4.6 },
  { name: '杭州', value: 4.3 },
]

const trendChartOption = computed<EChartsOption>(() => ({
  tooltip: {
    trigger: 'axis',
  },
  legend: {
    data: ['平均满意度'],
  },
  xAxis: {
    type: 'category',
    data: trendData.value.map((item: any) => item.date.slice(5)),
  },
  yAxis: {
    type: 'value',
    min: 0,
    max: 5,
  },
  series: [
    {
      name: '平均满意度',
      type: 'line',
      smooth: true,
      data: trendData.value.map((item: any) => item.score.toFixed(2)),
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(64, 158, 255, 0.3)' },
            { offset: 1, color: 'rgba(64, 158, 255, 0.05)' },
          ],
        },
      },
    },
  ],
}))

const pieChartOption = computed<EChartsOption>(() => ({
  tooltip: {
    trigger: 'item',
    formatter: '{b}: {c} ({d}%)',
  },
  legend: {
    orient: 'vertical',
    right: 10,
    top: 'center',
  },
  series: [
    {
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2,
      },
      label: {
        show: false,
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 16,
          fontWeight: 'bold',
        },
      },
      data: issueCategories,
    },
  ],
}))

const barChartOption = computed<EChartsOption>(() => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
  },
  xAxis: {
    type: 'category',
    data: regionData.map(item => item.name),
  },
  yAxis: {
    type: 'value',
    min: 0,
    max: 5,
  },
  series: [
    {
      name: '满意度',
      type: 'bar',
      data: regionData.map(item => item.value),
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: '#409eff' },
            { offset: 1, color: '#67c23a' },
          ],
        },
      },
    },
  ],
}))
</script>

<style scoped>
.dashboard-page {
  width: 100%;
}

.kpi-section {
  margin-bottom: 20px;
}

.chart-section {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
