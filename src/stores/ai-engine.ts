import { defineStore } from 'pinia'
import type { AIInspectionResult } from '@/types'

interface AIEngineState {
  isAnalyzing: boolean
  progress: number
  results: AIInspectionResult[]
  cachedResults: Map<string, AIInspectionResult>
}

export const useAIEngineStore = defineStore('aiEngine', {
  state: (): AIEngineState => ({
    isAnalyzing: false,
    progress: 0,
    results: [],
    cachedResults: new Map(),
  }),

  actions: {
    setAnalyzing(status: boolean) {
      this.isAnalyzing = status
      if (!status) {
        this.progress = 0
      }
    },

    setProgress(progress: number) {
      this.progress = Math.min(100, Math.max(0, progress))
    },

    addResult(result: AIInspectionResult) {
      this.results.push(result)
      this.cachedResults.set(result.conversationId, result)
    },

    getCachedResult(conversationId: string): AIInspectionResult | undefined {
      return this.cachedResults.get(conversationId)
    },

    clearResults() {
      this.results = []
    },
  },
})
