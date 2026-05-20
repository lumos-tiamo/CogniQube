import * as XLSX from 'xlsx'
import { downloadFile } from './index'
import type { Conversation } from '@/types'

export const exportToExcel = (data: Conversation[], filename = 'conversations.xlsx') => {
  const worksheet = XLSX.utils.json_to_sheet(
    data.map(item => ({
      会话ID: item.id,
      客服姓名: item.agentName,
      用户ID: item.userId,
      开始时间: item.startTime,
      结束时间: item.endTime,
      时长: `${item.duration}秒`,
      满意度: item.satisfaction,
      AI评分: item.aiScore || '-',
      状态: item.status,
      标签: item.tags.join(', '),
      地区: item.region || '-',
    }))
  )

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, '会话数据')

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })

  downloadFile(blob, filename)
}
