<template>
  <div class="config-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>质检规则配置</span>
          <el-button type="primary" @click="handleAddRule">
            <el-icon><Plus /></el-icon>
            添加规则
          </el-button>
        </div>
      </template>

      <el-table :data="rules" border stripe>
        <el-table-column prop="name" label="规则名称" width="200" />
        <el-table-column prop="type" label="规则类型" width="150">
          <template #default="{ row }">
            <el-tag>{{ getRuleTypeLabel(row.type) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="config" label="规则配置">
          <template #default="{ row }">
            <pre class="config-preview">{{ JSON.stringify(row.config, null, 2) }}</pre>
          </template>
        </el-table-column>
        <el-table-column prop="enabled" label="状态" width="100">
          <template #default="{ row }">
            <el-switch v-model="row.enabled" @change="handleToggleRule(row)" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEditRule(row)">
              编辑
            </el-button>
            <el-button type="danger" size="small" @click="handleDeleteRule(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑规则' : '添加规则'" width="600px">
      <el-form :model="ruleForm" label-width="100px">
        <el-form-item label="规则名称" required>
          <el-input v-model="ruleForm.name" placeholder="请输入规则名称" />
        </el-form-item>
        <el-form-item label="规则类型" required>
          <el-select v-model="ruleForm.type" placeholder="请选择规则类型">
            <el-option label="关键词触发" value="keyword" />
            <el-option label="响应超时" value="timeout" />
            <el-option label="情感分析" value="sentiment" />
          </el-select>
        </el-form-item>
        <el-form-item label="规则配置" required>
          <el-input
            v-model="configJson"
            type="textarea"
            :rows="8"
            placeholder='{"key": "value"}'
          />
          <div class="config-hint">
            <el-text type="info" size="small">
              请输入有效的JSON格式配置
            </el-text>
          </div>
        </el-form-item>
        <el-form-item label="启用状态">
          <el-switch v-model="ruleForm.enabled" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useConfigStore } from '@/stores/config'
import type { InspectionRule } from '@/types'

const configStore = useConfigStore()

const dialogVisible = ref(false)
const isEdit = ref(false)
const currentRuleId = ref('')
const configJson = ref('')

const ruleForm = ref<Omit<InspectionRule, 'id'>>({
  name: '',
  type: 'keyword',
  config: {},
  enabled: true,
})

const rules = computed(() => configStore.rules)

const getRuleTypeLabel = (type: string) => {
  const map: Record<string, string> = {
    keyword: '关键词触发',
    timeout: '响应超时',
    sentiment: '情感分析',
  }
  return map[type] || type
}

const handleAddRule = () => {
  isEdit.value = false
  ruleForm.value = {
    name: '',
    type: 'keyword',
    config: {},
    enabled: true,
  }
  configJson.value = '{}'
  dialogVisible.value = true
}

const handleEditRule = (row: InspectionRule) => {
  isEdit.value = true
  currentRuleId.value = row.id
  ruleForm.value = {
    name: row.name,
    type: row.type,
    config: row.config,
    enabled: row.enabled,
  }
  configJson.value = JSON.stringify(row.config, null, 2)
  dialogVisible.value = true
}

const handleDeleteRule = async (row: InspectionRule) => {
  try {
    await ElMessageBox.confirm('确认删除该规则？', '提示', {
      type: 'warning',
    })
    configStore.deleteRule(row.id)
    ElMessage.success('删除成功')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const handleToggleRule = (row: InspectionRule) => {
  configStore.updateRule(row.id, { enabled: row.enabled })
  ElMessage.success(row.enabled ? '规则已启用' : '规则已禁用')
}

const handleSubmit = () => {
  if (!ruleForm.value.name) {
    ElMessage.warning('请输入规则名称')
    return
  }

  try {
    const config = JSON.parse(configJson.value)
    ruleForm.value.config = config
  } catch (error) {
    ElMessage.error('配置格式错误，请输入有效的JSON')
    return
  }

  if (isEdit.value) {
    configStore.updateRule(currentRuleId.value, ruleForm.value)
    ElMessage.success('更新成功')
  } else {
    const newRule: InspectionRule = {
      id: `rule_${Date.now()}`,
      ...ruleForm.value,
    }
    configStore.addRule(newRule)
    ElMessage.success('添加成功')
  }

  dialogVisible.value = false
}
</script>

<style scoped>
.config-page {
  width: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.config-preview {
  font-size: 12px;
  color: #606266;
  background: #f5f7fa;
  padding: 8px;
  border-radius: 4px;
  max-height: 100px;
  overflow-y: auto;
}

.config-hint {
  margin-top: 8px;
}
</style>
