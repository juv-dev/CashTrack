import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useBudgets } from './useBudgets'
import { useDefaultData } from './useDefaultData'

export const useCategoryLogic = () => {
  const route = useRoute()
  const categoryId = computed(() => route.params.categoryId as string)

  // Use Vue Query for budgets
  const { tables, isLoading, isError, error, addItemMutation, updateItemMutation, deleteItemMutation } = useBudgets()

  // Find current category
  const currentCategory = computed(() => {
    if (!tables || !('value' in tables) || !tables.value) return null
    return tables.value.find((table: any) => table.id === categoryId.value) || null
  })

  // State for modals and editing
  const showAddItemModal = ref(false)
  const newItemName = ref('')
  const newItemAmount = ref('')
  const editingItemId = ref<string | null>(null)
  const editItemValues = ref<Record<string, { name: string, amount: string }>>({})

  // Computed
  const currency = computed(() => 'S/')

  const { calculateTableTotal } = useDefaultData()

  // Actions
  const startEditItem = (itemId: string) => {
    const item = currentCategory.value?.items.find((i: any) => i.id === itemId)
    if (item) {
      editingItemId.value = itemId
      editItemValues.value[itemId] = {
        name: item.name,
        amount: item.amount.toString()
      }
    }
  }

  const cancelEditItem = () => {
    editingItemId.value = null
    editItemValues.value = {}
  }

  const saveEditItem = (itemId: string) => {
    const values = editItemValues.value[itemId]
    if (!values) return

    const amount = parseFloat(values.amount)
    if (isNaN(amount) || amount <= 0) return

    updateItemMutation.mutate({
      tableId: categoryId.value,
      itemId,
      updates: {
        name: values.name.trim(),
        amount
      }
    })

    cancelEditItem()
  }

  const deleteItem = (itemId: string) => {
    if (confirm('¿Estás seguro de eliminar este item?')) {
      deleteItemMutation.mutate({
        tableId: categoryId.value,
        itemId
      })
    }
  }

  const addItem = () => {
    if (!newItemName.value.trim() || !newItemAmount.value.trim()) return

    const amount = parseFloat(newItemAmount.value)
    if (isNaN(amount) || amount <= 0) return

    addItemMutation.mutate({
      tableId: categoryId.value,
      item: {
        name: newItemName.value.trim(),
        amount
      }
    })

    newItemName.value = ''
    newItemAmount.value = ''
    showAddItemModal.value = false
  }

  return {
    // Data
    categoryId,
    currentCategory,
    isLoading,
    isError,
    error,
    currency,
    
    // State
    showAddItemModal,
    newItemName,
    newItemAmount,
    editingItemId,
    editItemValues,
    
    // Mutations
    addItemMutation,
    updateItemMutation,
    deleteItemMutation,
    
    // Actions
    startEditItem,
    cancelEditItem,
    saveEditItem,
    deleteItem,
    addItem,
    
    // Utils
    calculateTableTotal
  }
}
