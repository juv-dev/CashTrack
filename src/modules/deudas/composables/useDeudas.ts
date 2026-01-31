import { ref, computed, watch } from 'vue'
import { useAuthStore } from '~/stores/auth'
import type { CreditCardDebt } from '~/shared/types'

export function useDeudas() {
  const authStore = useAuthStore()
  
  // Reactive state
  const debts = ref<CreditCardDebt[]>([])
  const history = ref<CreditCardDebt[]>([])
  
  // Load debts from localStorage
  const loadDebts = () => {
    if (!authStore.user) return
    
    const storageKey = `credit_debts_${authStore.user.id}`
    const stored = localStorage.getItem(storageKey)
    
    if (stored) {
      try {
        debts.value = JSON.parse(stored)
      } catch (e) {
        console.error('Error loading debts from localStorage:', e)
        debts.value = []
      }
    } else {
      debts.value = []
    }
    
    // Update planning data with current debt total
    updatePlanningDebt()
  }
  
  // Load history from localStorage
  const loadHistory = () => {
    if (!authStore.user) return
    
    const storageKey = `credit_debts_history_${authStore.user.id}`
    const stored = localStorage.getItem(storageKey)
    
    if (stored) {
      try {
        history.value = JSON.parse(stored)
      } catch (e) {
        console.error('Error loading history from localStorage:', e)
        history.value = []
      }
    } else {
      history.value = []
    }
  }
  
  // Save debts to localStorage
  const saveDebts = () => {
    if (!authStore.user) return
    
    const storageKey = `credit_debts_${authStore.user.id}`
    localStorage.setItem(storageKey, JSON.stringify(debts.value))
    
    // Update planning data
    updatePlanningDebt()
  }
  
  // Save history to localStorage
  const saveHistory = () => {
    if (!authStore.user) return
    
    const storageKey = `credit_debts_history_${authStore.user.id}`
    localStorage.setItem(storageKey, JSON.stringify(history.value))
  }
  
  // Update planning data with current debt total
  const updatePlanningDebt = () => {
    if (!authStore.user) return
    
    const planningStorageKey = `budgetPlanning_${authStore.user.id}`
    const planningStored = localStorage.getItem(planningStorageKey)
    
    if (planningStored) {
      try {
        const planningData = JSON.parse(planningStored)
        const currentDebtTotal = debts.value.reduce((sum, debt) => sum + debt.amount, 0)
        
        planningData.creditCardDebt = currentDebtTotal
        localStorage.setItem(planningStorageKey, JSON.stringify(planningData))
      } catch (e) {
        console.error('Error updating planning debt:', e)
      }
    }
  }
  
  // Add new debt
  const addDebt = (debt: Omit<CreditCardDebt, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!authStore.user) return
    
    const newDebt: CreditCardDebt = {
      ...debt,
      id: Date.now().toString(),
      userId: authStore.user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    debts.value.push(newDebt)
    saveDebts()
    return newDebt
  }
  
  // Update debt status
  const updateDebtStatus = (debtId: string, status: 'pending' | 'partial' | 'paid', paidInstallments?: number) => {
    const debtIndex = debts.value.findIndex(d => d.id === debtId)
    if (debtIndex === -1) return
    
    const debt = debts.value[debtIndex]
    if (!debt) return
    
    debt.status = status
    debt.updatedAt = new Date().toISOString()
    
    if (paidInstallments !== undefined) {
      debt.paidInstallments = paidInstallments
    }
    
    // If fully paid, move to history
    if (status === 'paid') {
      history.value.push(debt)
      debts.value.splice(debtIndex, 1)
      saveHistory()
    } else {
      saveDebts()
    }
  }
  
  // Delete debt
  const deleteDebt = (debtId: string) => {
    const debtIndex = debts.value.findIndex(d => d.id === debtId)
    if (debtIndex === -1) return
    
    debts.value.splice(debtIndex, 1)
    saveDebts()
  }
  
  // Computed properties
  const totalDebt = computed(() => {
    return debts.value.reduce((sum, debt) => sum + debt.amount, 0)
  })
  
  const pendingDebts = computed(() => {
    return debts.value.filter(debt => debt.status === 'pending')
  })
  
  const partialDebts = computed(() => {
    return debts.value.filter(debt => debt.status === 'partial')
  })
  
  const totalHistoryDebt = computed(() => {
    return history.value.reduce((sum, debt) => sum + debt.amount, 0)
  })
  
  // Initialize
  const initialize = () => {
    loadDebts()
    loadHistory()
  }
  
  // Watch for changes in debts to update planning
  watch(debts, () => {
    updatePlanningDebt()
  }, { deep: true })
  
  return {
    // State
    debts,
    history,
    
    // Computed
    totalDebt,
    pendingDebts,
    partialDebts,
    totalHistoryDebt,
    
    // Methods
    initialize,
    addDebt,
    updateDebtStatus,
    deleteDebt,
    saveDebts,
    saveHistory,
    loadDebts,
    loadHistory,
    updatePlanningDebt
  }
}
