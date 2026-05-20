// Web Worker for data processing
self.addEventListener('message', (e: MessageEvent) => {
  const { type, data } = e.data

  switch (type) {
    case 'CALCULATE_STATISTICS':
      const stats = calculateStatistics(data)
      self.postMessage({ type: 'STATISTICS_RESULT', data: stats })
      break

    case 'PROCESS_EXPORT_DATA':
      const processed = processExportData(data)
      self.postMessage({ type: 'EXPORT_DATA_READY', data: processed })
      break

    default:
      break
  }
})

function calculateStatistics(conversations: any[]) {
  const total = conversations.length
  const totalScore = conversations.reduce((sum, conv) => sum + (conv.aiScore || 0), 0)
  const averageScore = total > 0 ? totalScore / total : 0
  const failureCount = conversations.filter(conv => (conv.aiScore || 0) < 60).length
  const failureRate = total > 0 ? failureCount / total : 0

  return {
    total,
    averageScore,
    failureRate,
    failureCount,
  }
}

function processExportData(conversations: any[]) {
  return conversations.map(conv => ({
    id: conv.id,
    agentName: conv.agentName,
    userId: conv.userId,
    startTime: conv.startTime,
    endTime: conv.endTime,
    duration: conv.duration,
    satisfaction: conv.satisfaction,
    aiScore: conv.aiScore || '-',
    status: conv.status,
    tags: conv.tags.join(', '),
    region: conv.region || '-',
  }))
}

export {}
