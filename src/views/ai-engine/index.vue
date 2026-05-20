<template>
  <div class="ai-engine-page">
    <el-card class="control-card">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-statistic title="待分析会话数" :value="pendingCount" />
        </el-col>
        <el-col :span="12">
          <el-statistic title="已分析会话数" :value="analyzedCount" />
        </el-col>
      </el-row>

      <el-divider />

      <div class="control-actions">
        <el-button
          type="primary"
          size="large"
          :loading="isAnalyzing"
          :disabled="pendingCount === 0"
          @click="handleStartAnalysis"
        >
          <el-icon><MagicStick /></el-icon>
          {{ isAnalyzing ? '分析中...' : '开始批量分析' }}
        </el-button>
        <el-button size="large" @click="handleViewResults">查看分析结果</el-button>
        <el-button size="large" @click="handleClearCache">清除缓存</el-button>
      </div>

      <el-progress
        v-if="isAnalyzing"
        :percentage="progress"
        :status="progress === 100 ? 'success' : undefined"
        class="progress-bar"
      />
    </el-card>

    <el-card v-if="results.length > 0" class="results-card">
      <template #header>
        <div class="card-header">
          <span>分析结果</span>
          <el-button type="primary" size="small" @click="handleExportResults">
            导出结果
          </el-button>
        </div>
      </template>

      <el-table :data="results" border stripe>
        <el-table-column prop="conversationId" label="会话ID" width="180" />
        <el-table-column prop="score" label="AI评分" width="100">
          <template #default="{ row }">
            <el-tag :type="getScoreType(row.score)">{{ row.score }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="sentiment" label="情感分析" width="120">
          <template #default="{ row }">
            <el-tag :type="getSentimentType(row.sentiment)">
              {{ getSentimentLabel(row.sentiment) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="issues" label="问题标签" width="250">
          <template #default="{ row }">
            <el-tag
              v-for="issue in row.issues"
              :key="issue"
              size="small"
              type="danger"
              style="margin-right: 4px"
            >
              {{ issue }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="suggestions" label="改进建议">
          <template #default="{ row }">
            <ul class="suggestion-list">
              <li v-for="(suggestion, index) in row.suggestions" :key="index">
                {{ suggestion }}
              </li>
            </ul>
          </template>
        </el-table-column>
        <el-table-column prop="timestamp" label="分析时间" width="180" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="success" size="small" @click="handleAccept(row)">
              接受
            </el-button>
            <el-button type="danger" size="small" @click="handleReject(row)">
              驳回
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAIEngineStore } from '@/stores/ai-engine'
import { conversationApi } from '@/api'
import { saveAIResult, getAllAIResults, clearAllAIResults } from '@/utils/db'
import pLimit from 'p-limit'
import type { AIInspectionResult } from '@/types'

const aiEngineStore = useAIEngineStore()

const pendingCount = ref(0)
const analyzedCount = ref(0)
const results = ref<AIInspectionResult[]>([])

const isAnalyzing = computed(() => aiEngineStore.isAnalyzing)
const progress = computed(() => aiEngineStore.progress)

const getScoreType = (score: number) => {
  if (score >= 80) return 'success'
  if (score >= 60) return 'warning'
  return 'danger'
}

const getSentimentType = (sentiment: string) => {
  const map: Record<string, any> = {
    positive: 'success',
    neutral: 'info',
    negative: 'danger',
  }
  return map[sentiment] || 'info'
}

const getSentimentLabel = (sentiment: string) => {
  const map: Record<string, string> = {
    positive: '积极',
    neutral: '中性',
    negative: '消极',
  }
  return map[sentiment] || sentiment
}

const loadPendingCount = async () => {
  // 使用模拟数据
  pendingCount.value = 15
}

const loadAnalyzedResults = async () => {
  try {
    const cachedResults = await getAllAIResults()
    results.value = cachedResults
    analyzedCount.value = cachedResults.length
  } catch (error) {
    console.error('加载分析结果失败:', error)
  }
}

const handleStartAnalysis = async () => {
  try {
    await ElMessageBox.confirm(
      `即将分析 ${pendingCount.value} 条待审核会话，是否继续？`,
      '确认分析',
      {
        type: 'warning',
      }
    )

    aiEngineStore.setAnalyzing(true)
    aiEngineStore.clearResults()

    const mockConversations = Array.from({ length: pendingCount.value }, (_, i) => ({
      id: `conv_${i + 1}`,
    }))

    const limit = pLimit(3)
    const total = mockConversations.length
    let completed = 0

    const tasks = mockConversations.map((conv: any) =>
      limit(async () => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500))

          const result: AIInspectionResult = {
            conversationId: conv.id,
            score: Math.floor(Math.random() * 40) + 60,
            issues: ['响应慢', '专业性不足'].slice(0, Math.floor(Math.random() * 2) + 1),
            suggestions: ['建议加快响应速度', '建议提升专业知识'],
            sentiment: ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)] as any,
            timestamp: new Date().toISOString(),
          }

          aiEngineStore.addResult(result)
          await saveAIResult(result)
        } catch (error) {
          console.error(`分析会话 ${conv.id} 失败:`, error)
        } finally {
          completed++
          aiEngineStore.setProgress((completed / total) * 100)
        }
      })
    )

    await Promise.all(tasks)

    ElMessage.success('批量分析完成')
    results.value = aiEngineStore.results
    analyzedCount.value = results.value.length
    pendingCount.value = 0
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('分析失败')
    }
  } finally {
    aiEngineStore.setAnalyzing(false)
  }
}

const handleViewResults = async () => {
  await loadAnalyzedResults()
  if (results.value.length === 0) {
    ElMessage.info('暂无分析结果')
  }
}

const handleClearCache = async () => {
  try {
    await ElMessageBox.confirm('确认清除所有缓存的分析结果？', '提示', {
      type: 'warning',
    })
    await clearAllAIResults()
    results.value = []
    analyzedCount.value = 0
    ElMessage.success('缓存已清除')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('清除失败')
    }
  }
}

const handleAccept = async (row: AIInspectionResult) => {
  try {
    await conversationApi.updateStatus(row.conversationId, 'approved')
    ElMessage.success('已接受AI评分')
    results.value = results.value.filter(r => r.conversationId !== row.conversationId)
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const handleReject = async (row: AIInspectionResult) => {
  try {
    await conversationApi.updateStatus(row.conversationId, 'rejected')
    ElMessage.success('已驳回AI评分')
    results.value = results.value.filter(r => r.conversationId !== row.conversationId)
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

const handleExportResults = () => {
  ElMessage.info('导出功能开发中')
}

onMounted(async () => {
  await Promise.all([loadPendingCount(), loadAnalyzedResults()])
})
</script>

<style scoped>
.ai-engine-page {
  width: 100%;
}

.control-card {
  margin-bottom: 20px;
}

.control-actions {
  margin-top: 20px;
  display: flex;
  gap: 12px;
}

.progress-bar {
  margin-top: 20px;
}

.results-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.suggestion-list {
  margin: 0;
  padding-left: 20px;
}

.suggestion-list li {
  margin-bottom: 4px;
  font-size: 13px;
  color: #606266;
}
</style>
