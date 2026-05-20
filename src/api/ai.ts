import request from '@/utils/request'
import type { AIInspectionResult } from '@/types'

export interface AIAnalysisRequest {
  conversationId: string
  messages: Array<{ role: string; content: string }>
}

export const aiApi = {
  analyze(data: AIAnalysisRequest) {
    return request.post<AIInspectionResult>('/ai/analyze', data)
  },

  batchAnalyze(conversationIds: string[]) {
    return request.post<AIInspectionResult[]>('/ai/batch-analyze', { conversationIds })
  },

  getCachedResult(conversationId: string) {
    return request.get<AIInspectionResult>(`/ai/cache/${conversationId}`)
  },
}
