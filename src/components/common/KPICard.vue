<template>
  <div class="kpi-card">
    <div class="kpi-icon" :style="{ background: color }">
      <el-icon :size="32">
        <component :is="icon" />
      </el-icon>
    </div>
    <div class="kpi-content">
      <div class="kpi-value">{{ value }}</div>
      <div class="kpi-label">{{ label }}</div>
    </div>
    <div v-if="trend" class="kpi-trend" :class="trendClass">
      <el-icon>
        <component :is="trend > 0 ? 'CaretTop' : 'CaretBottom'" />
      </el-icon>
      <span>{{ Math.abs(trend) }}%</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  icon: string
  label: string
  value: string | number
  color?: string
  trend?: number
}

const props = withDefaults(defineProps<Props>(), {
  color: '#409eff',
  trend: undefined,
})

const trendClass = computed(() => {
  if (!props.trend) return ''
  return props.trend > 0 ? 'trend-up' : 'trend-down'
})
</script>

<style scoped>
.kpi-card {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s;
}

.kpi-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.kpi-icon {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.kpi-content {
  flex: 1;
}

.kpi-value {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 4px;
}

.kpi-label {
  font-size: 14px;
  color: #909399;
}

.kpi-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 500;
}

.trend-up {
  color: #67c23a;
}

.trend-down {
  color: #f56c6c;
}
</style>
