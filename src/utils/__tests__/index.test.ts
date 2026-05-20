import { describe, it, expect } from 'vitest'
import { formatDuration, getScoreColor, getScoreLevel } from '@/utils'

describe('Utils', () => {
  describe('formatDuration', () => {
    it('should format seconds correctly', () => {
      expect(formatDuration(45)).toBe('45秒')
    })

    it('should format minutes and seconds correctly', () => {
      expect(formatDuration(125)).toBe('2分5秒')
    })

    it('should format hours, minutes and seconds correctly', () => {
      expect(formatDuration(3665)).toBe('1小时1分5秒')
    })
  })

  describe('getScoreColor', () => {
    it('should return green for high scores', () => {
      expect(getScoreColor(85)).toBe('#67c23a')
    })

    it('should return orange for medium scores', () => {
      expect(getScoreColor(70)).toBe('#e6a23c')
    })

    it('should return red for low scores', () => {
      expect(getScoreColor(50)).toBe('#f56c6c')
    })
  })

  describe('getScoreLevel', () => {
    it('should return correct level for scores', () => {
      expect(getScoreLevel(95)).toBe('优秀')
      expect(getScoreLevel(85)).toBe('良好')
      expect(getScoreLevel(70)).toBe('合格')
      expect(getScoreLevel(50)).toBe('不合格')
    })
  })
})
