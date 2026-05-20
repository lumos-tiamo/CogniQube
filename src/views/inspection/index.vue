<template>
  <div class="inspection-page">
    <el-card class="filter-card">
      <el-form :inline="true" :model="filterForm">
        <el-form-item label="日期范围">
          <el-date-picker
            v-model="filterForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filterForm.status" multiple placeholder="请选择状态" clearable>
            <el-option label="待审核" value="pending" />
            <el-option label="已审核" value="reviewed" />
            <el-option label="已通过" value="approved" />
            <el-option label="已驳回" value="rejected" />
          </el-select>
        </el-form-item>
        <el-form-item label="评分范围">
          <el-slider
            v-model="filterForm.scoreRange"
            range
            :min="0"
            :max="100"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button type="success" :disabled="!selectedIds.length" @click="handleBatchApprove">
            批量通过
          </el-button>
          <el-button type="danger" :disabled="!selectedIds.length" @click="handleBatchReject">
            批量驳回
          </el-button>
          <el-button @click="handleExport">导出Excel</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-card">
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        stripe
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="会话ID" width="180" />
        <el-table-column prop="agentName" label="客服姓名" width="120" />
        <el-table-column prop="userId" label="用户ID" width="150" />
        <el-table-column prop="startTime" label="开始时间" width="180" />
        <el-table-column prop="duration" label="时长" width="100">
          <template #default="{ row }">
            {{ formatDuration(row.duration) }}
          </template>
        </el-table-column>
        <el-table-column prop="satisfaction" label="满意度" width="100">
          <template #default="{ row }">
            <el-rate v-model="row.satisfaction" disabled />
          </template>
        </el-table-column>
        <el-table-column prop="aiScore" label="AI评分" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.aiScore" :type="getScoreType(row.aiScore)">
              {{ row.aiScore }}
            </el-tag>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="tags" label="标签" width="150">
          <template #default="{ row }">
            <el-tag v-for="tag in row.tags" :key="tag" size="small" style="margin-right: 4px">
              {{ tag }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleViewDetail(row)">
              查看详情
            </el-button>
            <el-button type="success" size="small" @click="handleReview(row)">
              复核
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      />
    </el-card>

    <el-dialog v-model="detailVisible" title="会话详情" width="800px">
      <div v-if="currentConversation" class="conversation-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="会话ID">{{ currentConversation.id }}</el-descriptions-item>
          <el-descriptions-item label="客服姓名">{{ currentConversation.agentName }}</el-descriptions-item>
          <el-descriptions-item label="用户ID">{{ currentConversation.userId }}</el-descriptions-item>
          <el-descriptions-item label="时长">{{ formatDuration(currentConversation.duration) }}</el-descriptions-item>
          <el-descriptions-item label="满意度">
            <el-rate v-model="currentConversation.satisfaction" disabled />
          </el-descriptions-item>
          <el-descriptions-item label="AI评分">{{ currentConversation.aiScore || '-' }}</el-descriptions-item>
        </el-descriptions>

        <el-divider>聊天记录</el-divider>
        <div class="message-list">
          <div
            v-for="msg in currentConversation.messages"
            :key="msg.id"
            :class="['message-item', msg.role]"
          >
            <div class="message-header">
              <span class="role">{{ msg.role === 'agent' ? '客服' : '用户' }}</span>
              <span class="time">{{ msg.timestamp }}</span>
            </div>
            <div class="message-content">{{ msg.content }}</div>
          </div>
        </div>
      </div>
    </el-dialog>

    <el-dialog v-model="reviewVisible" title="人工复核" width="600px">
      <el-form :model="reviewForm" label-width="80px">
        <el-form-item label="评分">
          <el-input-number v-model="reviewForm.score" :min="0" :max="100" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="reviewForm.remark" type="textarea" :rows="4" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="reviewVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitReview">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { conversationApi } from '@/api'
import { formatDuration } from '@/utils'
import { exportToExcel } from '@/utils/export'
import type { Conversation } from '@/types'

const loading = ref(false)
const tableData = ref<Conversation[]>([])
const selectedIds = ref<string[]>([])
const detailVisible = ref(false)
const reviewVisible = ref(false)
const currentConversation = ref<Conversation | null>(null)

const filterForm = reactive<{
  dateRange: [string, string] | undefined
  status: string[]
  scoreRange: [number, number]
}>({
  dateRange: undefined,
  status: [],
  scoreRange: [0, 100],
})

const reviewForm = reactive({
  score: 0,
  remark: '',
})

const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0,
})

const getScoreType = (score: number) => {
  if (score >= 80) return 'success'
  if (score >= 60) return 'warning'
  return 'danger'
}

const getStatusType = (status: string) => {
  const map: Record<string, any> = {
    pending: 'info',
    reviewed: 'warning',
    approved: 'success',
    rejected: 'danger',
  }
  return map[status] || 'info'
}

const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    pending: '待审核',
    reviewed: '已审核',
    approved: '已通过',
    rejected: '已驳回',
  }
  return map[status] || status
}

const loadData = async () => {
  loading.value = true
  try {
    const params = {
      ...filterForm,
      ...pagination,
    }
    const data = await conversationApi.getList(params) as any
    tableData.value = data
  } catch (error) {
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.page = 1
  loadData()
}

const handleReset = () => {
  filterForm.dateRange = undefined
  filterForm.status = []
  filterForm.scoreRange = [0, 100]
  pagination.page = 1
  loadData()
}

const handleSelectionChange = (selection: Conversation[]) => {
  selectedIds.value = selection.map(item => item.id)
}

const handleBatchApprove = async () => {
  try {
    await ElMessageBox.confirm('确认批量通过选中的会话？', '提示', {
      type: 'warning',
    })
    await conversationApi.batchUpdate(selectedIds.value, 'approved')
    ElMessage.success('操作成功')
    loadData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败')
    }
  }
}

const handleBatchReject = async () => {
  try {
    await ElMessageBox.confirm('确认批量驳回选中的会话？', '提示', {
      type: 'warning',
    })
    await conversationApi.batchUpdate(selectedIds.value, 'rejected')
    ElMessage.success('操作成功')
    loadData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('操作失败')
    }
  }
}

const handleExport = () => {
  exportToExcel(tableData.value, `会话质检数据_${Date.now()}.xlsx`)
  ElMessage.success('导出成功')
}

const handleViewDetail = async (row: Conversation) => {
  try {
    const data = await conversationApi.getById(row.id) as any
    currentConversation.value = data
    detailVisible.value = true
  } catch (error) {
    ElMessage.error('加载详情失败')
  }
}

const handleReview = (row: Conversation) => {
  currentConversation.value = row
  reviewForm.score = row.aiScore || 0
  reviewForm.remark = ''
  reviewVisible.value = true
}

const handleSubmitReview = async () => {
  if (!currentConversation.value) return

  try {
    await conversationApi.updateStatus(
      currentConversation.value.id,
      'reviewed',
      reviewForm.remark
    )
    ElMessage.success('复核成功')
    reviewVisible.value = false
    loadData()
  } catch (error) {
    ElMessage.error('复核失败')
  }
}

const handleSizeChange = () => {
  loadData()
}

const handlePageChange = () => {
  loadData()
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.inspection-page {
  width: 100%;
}

.filter-card {
  margin-bottom: 20px;
}

.table-card {
  margin-bottom: 20px;
}

.el-pagination {
  margin-top: 20px;
  justify-content: flex-end;
}

.conversation-detail {
  max-height: 600px;
  overflow-y: auto;
}

.message-list {
  margin-top: 20px;
}

.message-item {
  margin-bottom: 16px;
  padding: 12px;
  border-radius: 8px;
  background: #f5f7fa;
}

.message-item.agent {
  background: #e1f3d8;
}

.message-item.user {
  background: #ecf5ff;
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 12px;
  color: #909399;
}

.message-header .role {
  font-weight: bold;
  color: #303133;
}

.message-content {
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
}
</style>
