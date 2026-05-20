import request from '@/utils/request'
import type {
  Conversation,
  KPIData,
  IssueCategory,
  SatisfactionTrend,
  RegionSatisfaction,
  FilterOptions,
  PaginationParams,
} from '@/types'

export const conversationApi = {
  getList(params: FilterOptions & PaginationParams) {
    return request.get<Conversation[]>('/conversations', { params })
  },

  getById(id: string) {
    return request.get<Conversation>(`/conversations/${id}`)
  },

  updateStatus(id: string, status: Conversation['status'], remark?: string) {
    return request.put(`/conversations/${id}/status`, { status, remark })
  },

  batchUpdate(ids: string[], status: Conversation['status']) {
    return request.put('/conversations/batch', { ids, status })
  },
}

export const dashboardApi = {
  getKPIData(dateRange?: [string, string]) {
    return request.get<KPIData>('/dashboard/kpi', { params: { dateRange } })
  },

  getIssueCategories(dateRange?: [string, string]) {
    return request.get<IssueCategory[]>('/dashboard/issues', { params: { dateRange } })
  },

  getSatisfactionTrend(dateRange?: [string, string], type: 'day' | 'week' | 'month' = 'day') {
    return request.get<SatisfactionTrend[]>('/dashboard/trend', { params: { dateRange, type } })
  },

  getRegionSatisfaction(dateRange?: [string, string]) {
    return request.get<RegionSatisfaction[]>('/dashboard/regions', { params: { dateRange } })
  },
}
