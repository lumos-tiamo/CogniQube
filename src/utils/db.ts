import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { AIInspectionResult } from '@/types'

interface CogniQubeDB extends DBSchema {
  aiResults: {
    key: string
    value: AIInspectionResult
    indexes: { 'by-timestamp': string }
  }
}

let db: IDBPDatabase<CogniQubeDB> | null = null

export const initDB = async () => {
  if (db) return db

  db = await openDB<CogniQubeDB>('cogniqube-db', 1, {
    upgrade(database) {
      const store = database.createObjectStore('aiResults', { keyPath: 'conversationId' })
      store.createIndex('by-timestamp', 'timestamp')
    },
  })

  return db
}

export const saveAIResult = async (result: AIInspectionResult) => {
  const database = await initDB()
  await database.put('aiResults', result)
}

export const getAIResult = async (conversationId: string): Promise<AIInspectionResult | undefined> => {
  const database = await initDB()
  return database.get('aiResults', conversationId)
}

export const getAllAIResults = async (): Promise<AIInspectionResult[]> => {
  const database = await initDB()
  return database.getAll('aiResults')
}

export const deleteAIResult = async (conversationId: string) => {
  const database = await initDB()
  await database.delete('aiResults', conversationId)
}

export const clearAllAIResults = async () => {
  const database = await initDB()
  await database.clear('aiResults')
}
