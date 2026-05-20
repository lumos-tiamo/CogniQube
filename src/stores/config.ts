import { defineStore } from 'pinia'
import type { InspectionRule } from '@/types'

interface ConfigState {
  rules: InspectionRule[]
  theme: 'light' | 'dark'
}

export const useConfigStore = defineStore('config', {
  state: (): ConfigState => ({
    rules: [
      {
        id: 'rule_1',
        name: '响应时间检测',
        type: 'timeout',
        config: {
          maxResponseTime: 60,
          unit: '秒',
          action: '标记为不合格',
        },
        enabled: true,
      },
      {
        id: 'rule_2',
        name: '敏感词过滤',
        type: 'keyword',
        config: {
          keywords: ['投诉', '退款', '差评'],
          matchType: '包含',
          action: '自动标记',
        },
        enabled: true,
      },
      {
        id: 'rule_3',
        name: '情感分析',
        type: 'sentiment',
        config: {
          threshold: 0.3,
          negativeAction: '人工复核',
        },
        enabled: false,
      },
    ],
    theme: 'light',
  }),

  actions: {
    addRule(rule: InspectionRule) {
      this.rules.push(rule)
    },

    updateRule(id: string, updates: Partial<InspectionRule>) {
      const index = this.rules.findIndex(r => r.id === id)
      if (index !== -1) {
        this.rules[index] = { ...this.rules[index], ...updates }
      }
    },

    deleteRule(id: string) {
      this.rules = this.rules.filter(r => r.id !== id)
    },

    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light'
    },
  },

  persist: {
    key: 'cogniqube-config',
    storage: localStorage,
  },
})
