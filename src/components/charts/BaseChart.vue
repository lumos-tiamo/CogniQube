<template>
  <div ref="chartRef" class="chart-container" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

interface Props {
  option: EChartsOption
  height?: string
}

const props = withDefaults(defineProps<Props>(), {
  height: '400px',
})

const chartRef = ref<HTMLDivElement>()
let chartInstance: echarts.ECharts | null = null

const initChart = () => {
  if (!chartRef.value) return

  chartInstance = echarts.init(chartRef.value)
  chartInstance.setOption(props.option)

  window.addEventListener('resize', handleResize)
}

const handleResize = () => {
  chartInstance?.resize()
}

watch(
  () => props.option,
  newOption => {
    chartInstance?.setOption(newOption, true)
  },
  { deep: true }
)

onMounted(() => {
  initChart()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
})

defineExpose({
  getInstance: () => chartInstance,
})
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: v-bind(height);
}
</style>
