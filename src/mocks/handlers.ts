import { http, HttpResponse } from 'msw'
import type { Conversation, KPIData, IssueCategory, SatisfactionTrend, RegionSatisfaction, AIInspectionResult } from '@/types'

// Mock 会话数据
const mockConversations: Conversation[] = Array.from({ length: 50 }, (_, i) => ({
  id: `conv_${i + 1}`,
  agentId: `agent_${(i % 10) + 1}`,
  agentName: `客服${(i % 10) + 1}号`,
  userId: `user_${i + 1}`,
  startTime: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
  endTime: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
  duration: Math.floor(Math.random() * 1800) + 60,
  satisfaction: Math.floor(Math.random() * 5) + 1,
  aiScore: Math.floor(Math.random() * 40) + 60,
  status: ['pending', 'reviewed', 'approved', 'rejected'][Math.floor(Math.random() * 4)] as any,
  tags: ['响应慢', '态度好', '专业', '答非所问'].slice(0, Math.floor(Math.random() * 3) + 1),
  region: ['北京', '上海', '广州', '深圳', '杭州'][Math.floor(Math.random() * 5)],
  messages: [
    { id: '1', role: 'user', content: '你好，我想咨询一下产品问题', timestamp: new Date().toISOString() },
    { id: '2', role: 'agent', content: '您好，请问有什么可以帮您的？', timestamp: new Date().toISOString() },
  ],
}))

// Mock KPI 数据
const mockKPIData: KPIData = {
  totalConversations: 1250,
  averageScore: 82.5,
  failureRate: 0.12,
  aiMarkedCount: 156,
}

// Mock 问题分类
const mockIssueCategories: IssueCategory[] = [
  { name: '响应慢', count: 45, percentage: 28.8 },
  { name: '态度差', count: 32, percentage: 20.5 },
  { name: '答非所问', count: 38, percentage: 24.4 },
  { name: '专业性不足', count: 41, percentage: 26.3 },
]

// Mock 满意度趋势
const mockSatisfactionTrend: SatisfactionTrend[] = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  score: 3.5 + Math.random() * 1.5,
}))

// Mock 地区满意度
const mockRegionSatisfaction: RegionSatisfaction[] = [
  { region: '北京', score: 4.2, count: 250 },
  { region: '上海', score: 4.5, count: 320 },
  { region: '广州', score: 4.1, count: 180 },
  { region: '深圳', score: 4.6, count: 290 },
  { region: '杭州', score: 4.3, count: 210 },
]

export const handlers = [
  http.get('/api/conversations', () => {
    return HttpResponse.json({
      code: 200,
      message: 'success',
      data: mockConversations,
    })
  }),

  http.get('/api/conversations/:id', ({ params }) => {
    const conversation = mockConversations.find(c => c.id === params.id)
    return HttpResponse.json({
      code: 200,
      message: 'success',
      data: conversation,
    })
  }),

  http.put('/api/conversations/:id/status', () => {
    return HttpResponse.json({
      code: 200,
      message: 'success',
      data: null,
    })
  }),

  http.put('/api/conversations/batch', () => {
    return HttpResponse.json({
      code: 200,
      message: 'success',
      data: null,
    })
  }),

  http.get('/api/dashboard/kpi', () => {
    return HttpResponse.json({
      code: 200,
      message: 'success',
      data: mockKPIData,
    })
  }),

  http.get('/api/dashboard/issues', () => {
    return HttpResponse.json({
      code: 200,
      message: 'success',
      data: mockIssueCategories,
    })
  }),

  http.get('/api/dashboard/trend', () => {
    return HttpResponse.json({
      code: 200,
      message: 'success',
      data: mockSatisfactionTrend,
    })
  }),

  http.get('/api/dashboard/regions', () => {
    return HttpResponse.json({
      code: 200,
      message: 'success',
      data: mockRegionSatisfaction,
    })
  }),

  http.post('/api/ai/analyze', async ({ request }) => {
    const body = await request.json() as any
    const result: AIInspectionResult = {
      conversationId: body.conversationId,
      score: Math.floor(Math.random() * 40) + 60,
      issues: ['响应慢', '专业性不足'].slice(0, Math.floor(Math.random() * 2) + 1),
      suggestions: ['建议加快响应速度', '建议提升专业知识'],
      sentiment: ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)] as any,
      timestamp: new Date().toISOString(),
    }
    return HttpResponse.json({
      code: 200,
      message: 'success',
      data: result,
    })
  }),
]
