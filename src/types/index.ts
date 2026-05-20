// 会话数据类型
export interface Conversation {
  id: string
  agentId: string
  agentName: string
  userId: string
  startTime: string
  endTime: string
  duration: number // 秒
  satisfaction: number // 1-5
  aiScore?: number // 0-100
  status: 'pending' | 'reviewed' | 'approved' | 'rejected'
  tags: string[]
  region?: string
  messages: Message[]
}

// 消息类型
export interface Message {
  id: string
  role: 'agent' | 'user'
  content: string
  timestamp: string
}

// KPI 数据
export interface KPIData {
  totalConversations: number
  averageScore: number
  failureRate: number
  aiMarkedCount: number
}

// 质检问题分类
export interface IssueCategory {
  name: string
  count: number
  percentage: number
}

// 满意度趋势数据
export interface SatisfactionTrend {
  date: string
  score: number
  agentName?: string
}

// 地区满意度数据
export interface RegionSatisfaction {
  region: string
  score: number
  count: number
}

// AI 质检结果
export interface AIInspectionResult {
  conversationId: string
  score: number
  issues: string[]
  suggestions: string[]
  sentiment: 'positive' | 'neutral' | 'negative'
  timestamp: string
}

// 质检规则
export interface InspectionRule {
  id: string
  name: string
  type: 'keyword' | 'timeout' | 'sentiment'
  config: Record<string, any>
  enabled: boolean
}

// 筛选条件
export interface FilterOptions {
  dateRange?: [string, string] | undefined
  agentIds?: string[]
  status?: string[]
  scoreRange?: [number, number]
  regions?: string[]
  tags?: string[]
}

// 分页参数
export interface PaginationParams {
  page: number
  pageSize: number
  total?: number
}

// API 响应
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

// 表格列配置
export interface TableColumn {
  prop: string
  label: string
  width?: number
  sortable?: boolean
  visible?: boolean
}
