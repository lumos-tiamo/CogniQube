import { ref } from 'vue'

export function useDataWorker() {
  const worker = ref<Worker | null>(null)

  const initWorker = () => {
    if (!worker.value) {
      worker.value = new Worker(
        new URL('@/workers/data-processor.worker.ts', import.meta.url),
        { type: 'module' }
      )
    }
    return worker.value
  }

  const calculateStatistics = (data: any[]): Promise<any> => {
    return new Promise((resolve, reject) => {
      const w = initWorker()

      const handleMessage = (e: MessageEvent) => {
        if (e.data.type === 'STATISTICS_RESULT') {
          w.removeEventListener('message', handleMessage)
          resolve(e.data.data)
        }
      }

      const handleError = (error: ErrorEvent) => {
        w.removeEventListener('error', handleError)
        reject(error)
      }

      w.addEventListener('message', handleMessage)
      w.addEventListener('error', handleError)

      w.postMessage({ type: 'CALCULATE_STATISTICS', data })
    })
  }

  const processExportData = (data: any[]): Promise<any> => {
    return new Promise((resolve, reject) => {
      const w = initWorker()

      const handleMessage = (e: MessageEvent) => {
        if (e.data.type === 'EXPORT_DATA_READY') {
          w.removeEventListener('message', handleMessage)
          resolve(e.data.data)
        }
      }

      const handleError = (error: ErrorEvent) => {
        w.removeEventListener('error', handleError)
        reject(error)
      }

      w.addEventListener('message', handleMessage)
      w.addEventListener('error', handleError)

      w.postMessage({ type: 'PROCESS_EXPORT_DATA', data })
    })
  }

  const terminateWorker = () => {
    if (worker.value) {
      worker.value.terminate()
      worker.value = null
    }
  }

  return {
    calculateStatistics,
    processExportData,
    terminateWorker,
  }
}
