import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { BudgetsAPI } from '../services/api'

// Types
interface BudgetItem {
  id: string
  name: string
  amount: number
}

interface BudgetTable {
  id: string
  name: string
  description: string
  items: BudgetItem[]
}

// Query keys
export const budgetKeys = {
  all: ['budgets'] as const,
  tables: (userId: string) => [...budgetKeys.all, 'tables', userId] as const,
  table: (userId: string, tableId: string) => [...budgetKeys.tables(userId), tableId] as const,
}

// Composables
export function useBudgets() {
  const authStore = useAuthStore()
  const queryClient = useQueryClient()

  // Get all tables for current user
  const {
    data: tables = [],
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: budgetKeys.tables(authStore.user?.id || ''),
    queryFn: () => BudgetsAPI.getTables(authStore.user?.id || ''),
    enabled: computed(() => !!authStore.user?.id),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  // Get single table by ID
  const getTableById = (tableId: string) => {
    return useQuery({
      queryKey: budgetKeys.table(authStore.user?.id || '', tableId),
      queryFn: () => {
        const allTables = tables.value
        if (!allTables || !Array.isArray(allTables)) {
          return null
        }
        return allTables.find(table => table.id === tableId) || null
      },
      enabled: computed(() => !!authStore.user?.id && !!tables.value && Array.isArray(tables.value) && tables.value.length > 0),
      staleTime: 1000 * 60 * 5,
    })
  }

  // Add table mutation
  const addTableMutation = useMutation({
    mutationFn: (table: Omit<BudgetTable, 'id'>) => 
      BudgetsAPI.addTable(authStore.user?.id || '', table),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: budgetKeys.tables(authStore.user?.id || '') 
      })
    },
  })

  // Delete table mutation
  const deleteTableMutation = useMutation({
    mutationFn: (tableId: string) => 
      BudgetsAPI.deleteTable(authStore.user?.id || '', tableId),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: budgetKeys.tables(authStore.user?.id || '') 
      })
    },
  })

  // Add item mutation
  const addItemMutation = useMutation({
    mutationFn: ({ tableId, item }: { tableId: string; item: Omit<BudgetItem, 'id'> }) =>
      BudgetsAPI.addItem(authStore.user?.id || '', tableId, item),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: budgetKeys.tables(authStore.user?.id || '') 
      })
    },
  })

  // Update item mutation
  const updateItemMutation = useMutation({
    mutationFn: ({ 
      tableId, 
      itemId, 
      updates 
    }: { 
      tableId: string; 
      itemId: string; 
      updates: Partial<BudgetItem> 
    }) => BudgetsAPI.updateItem(authStore.user?.id || '', tableId, itemId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: budgetKeys.tables(authStore.user?.id || '') 
      })
    },
  })

  // Delete item mutation
  const deleteItemMutation = useMutation({
    mutationFn: ({ tableId, itemId }: { tableId: string; itemId: string }) =>
      BudgetsAPI.deleteItem(authStore.user?.id || '', tableId, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: budgetKeys.tables(authStore.user?.id || '') 
      })
    },
  })

  // Update table mutation
  const updateTableMutation = useMutation({
    mutationFn: ({ 
      tableId, 
      updates 
    }: { 
      tableId: string; 
      updates: Partial<BudgetTable> 
    }) => BudgetsAPI.updateTable(authStore.user?.id || '', tableId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: budgetKeys.tables(authStore.user?.id || '') 
      })
    },
  })

  // Computed values
  const grandTotal = computed(() => {
    if (!tables.value || !Array.isArray(tables.value)) {
      return 0
    }
    
    return tables.value.reduce((total, table) => {
      if (!table || !table.items || !Array.isArray(table.items)) {
        return total
      }
      const tableTotal = table.items.reduce((sum, item) => {
        return sum + (item?.amount || 0)
      }, 0)
      return total + tableTotal
    }, 0)
  })

  return {
    // Queries
    tables,
    isLoading,
    isError,
    error,
    refetch,
    getTableById,
    
    // Mutations
    addTableMutation,
    deleteTableMutation,
    updateTableMutation,
    addItemMutation,
    updateItemMutation,
    deleteItemMutation,
    
    // Computed
    grandTotal,
  }
}
