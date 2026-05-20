import { defineStore } from 'pinia'
import type { FilterOptions, PaginationParams } from '@/types'

interface InspectionState {
  filterOptions: FilterOptions
  pagination: PaginationParams
  selectedIds: string[]
}

export const useInspectionStore = defineStore('inspection', {
  state: (): InspectionState => ({
    filterOptions: {
      dateRange: undefined,
      agentIds: [],
      status: [],
      scoreRange: undefined,
      regions: [],
      tags: [],
    },
    pagination: {
      page: 1,
      pageSize: 20,
      total: 0,
    },
    selectedIds: [],
  }),

  actions: {
    setFilterOptions(options: Partial<FilterOptions>) {
      this.filterOptions = { ...this.filterOptions, ...options }
      this.pagination.page = 1
    },

    resetFilters() {
      this.filterOptions = {
        dateRange: undefined,
        agentIds: [],
        status: [],
        scoreRange: undefined,
        regions: [],
        tags: [],
      }
      this.pagination.page = 1
    },

    setPagination(pagination: Partial<PaginationParams>) {
      this.pagination = { ...this.pagination, ...pagination }
    },

    setSelectedIds(ids: string[]) {
      this.selectedIds = ids
    },
  },

  persist: {
    key: 'cogniqube-inspection',
    storage: localStorage,
    paths: ['filterOptions', 'pagination'],
  },
})
