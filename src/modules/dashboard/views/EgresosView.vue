<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/shared/components'
import { PieChart, LineChart, BarChart } from '~/shared/components'
import { useBudgets } from '~/modules/budget/composables/useBudgets'

// Use budgets for expenses (regresar al sistema original)
const { tables, addTableMutation, deleteTableMutation, updateTableMutation } = useBudgets()

// State for modals
const showAddCategoryModal = ref(false)
const showEditCategoriesModal = ref(false)
const newTableName = ref('')
const addTableError = ref('')

const editTableValues = ref<Record<string, { name: string, description: string }>>({})

// Computed properties for expenses
const totalExpenses = computed(() => {
  if (!tables || !('value' in tables) || !tables.value || tables.value.length === 0) return 0
  
  return tables.value.reduce((sum: number, table: any) => {
    return sum + table.items.reduce((itemSum: number, item: any) => itemSum + item.amount, 0)
  }, 0)
})

const averageExpense = computed(() => {
  if (!tables || !('value' in tables) || !tables.value || tables.value.length === 0) return 0
  return totalExpenses.value / tables.value.length
})

const highestCategory = computed(() => {
  if (!tables || !('value' in tables) || !tables.value || tables.value.length === 0) {
    return { name: 'Sin categorías', amount: 0 }
  }
  
  const categoryTotals = tables.value.map((table: any) => ({
    name: table.name,
    amount: table.items.reduce((sum: number, item: any) => sum + item.amount, 0)
  }))
  
  return categoryTotals.reduce((max: any, current: any) => 
    current.amount > max.amount ? current : max
  )
})

// Chart data for expenses
const expenseDistributionData = computed(() => {
  if (!tables || !('value' in tables) || !tables.value || tables.value.length === 0) {
    return {
      labels: ['Sin datos'],
      datasets: [{
        label: 'Gastos',
        data: [1],
        backgroundColor: ['#e5e7eb'],
        borderColor: ['#e5e7eb'],
        borderWidth: 1
      }]
    }
  }

  return {
    labels: tables.value.map((table: any) => table.name),
    datasets: [{
      label: 'Gastos',
      data: tables.value.map((table: any) => 
        table.items.reduce((sum: number, item: any) => sum + item.amount, 0)
      ),
      backgroundColor: tables.value.map((_: any, index: number) => {
        const colors = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899']
        return colors[index % colors.length] as string
      }),
      borderColor: tables.value.map((_: any, index: number) => {
        const colors = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899']
        return colors[index % colors.length] as string
      }),
      borderWidth: 1
    }]
  }
})

const expenseTrendData = computed(() => {
  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio']
  
  if (!tables || !('value' in tables) || !tables.value || tables.value.length === 0) {
    return {
      labels: months,
      datasets: [{
        label: 'Gastos',
        data: [0, 0, 0, 0, 0, 0],
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 2,
        tension: 0.4
      }]
    }
  }

  const baseAmount = totalExpenses.value
  const trendData = months.map((_: any, index: number) => {
    const variation = Math.sin(index * 0.4) * 150 + Math.random() * 75
    return Math.max(0, baseAmount + variation)
  })

  return {
    labels: months,
    datasets: [{
      label: 'Gastos Mensuales',
      data: trendData,
      borderColor: '#ef4444',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      borderWidth: 2,
      tension: 0.4
    }]
  }
})

const categoryComparisonData = computed(() => {
  if (!tables || !('value' in tables) || !tables.value || tables.value.length === 0) {
    return {
      labels: ['Sin datos'],
      datasets: [{
        label: 'Gastos',
        data: [0],
        backgroundColor: ['#e5e7eb'],
        borderColor: ['#e5e7eb'],
        borderWidth: 1
      }]
    }
  }

  return {
    labels: tables.value.map((table: any) => table.name),
    datasets: [{
      label: 'Gastos Actuales',
      data: tables.value.map((table: any) => 
        table.items.reduce((sum: number, item: any) => sum + item.amount, 0)
      ),
      backgroundColor: tables.value.map((_: any, index: number) => {
        const colors = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899']
        return colors[index % colors.length] as string
      }),
      borderColor: tables.value.map((_: any, index: number) => {
        const colors = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899']
        return colors[index % colors.length] as string
      }),
      borderWidth: 1
    }]
  }
})

const currency = computed(() => 'S/')

// Helper function to safely get edit value
const getEditTableValue = (tableId: string, field: 'name' | 'description') => {
  return editTableValues.value[tableId]?.[field] || ''
}

// Helper function to safely set edit value
const setEditTableValue = (tableId: string, field: 'name' | 'description', event: Event) => {
  const target = event.target as HTMLInputElement
  if (!editTableValues.value[tableId]) {
    editTableValues.value[tableId] = { name: '', description: '' }
  }
  editTableValues.value[tableId][field] = target.value
}

// Initialize edit values when tables change
watch(() => tables && 'value' in tables ? tables.value : [], (newTables: any) => {
  if (!newTables) return
  
  newTables.forEach((table: any) => {
    if (!editTableValues.value[table.id]) {
      editTableValues.value[table.id] = {
        name: table.name,
        description: table.description
      }
    }
  })
}, { immediate: true })

// CRUD functions
const addTable = () => {
  if (!newTableName.value.trim() || addTableMutation.isPending.value) return

  addTableError.value = ''

  addTableMutation.mutate({
    name: newTableName.value.trim(),
    description: 'Nueva categoría de egresos',
    items: [],
    userId: 'default-user',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }, {
    onSuccess: () => {
      newTableName.value = ''
      showAddCategoryModal.value = false
    },
    onError: (error: any) => {
      addTableError.value = error?.message || 'No se pudo crear la categoría. Inténtalo de nuevo.'
    }
  })
}

const saveEditTable = (tableId: string) => {
  const values = editTableValues.value[tableId]
  if (!values) return
  
  updateTableMutation.mutate({
    tableId,
    updates: { 
      name: values.name.trim(),
      description: values.description.trim()
    }
  })
}

const cancelEditTable = (tableId?: string) => {
  if (tableId) {
    delete editTableValues.value[tableId]
  }
}

const deleteTable = (tableId: string) => {
  const table = tables && 'value' in tables ? tables.value?.find((t: any) => t.id === tableId) : null
  if (confirm(`¿Estás seguro de eliminar la categoría "${table?.name}"? Esta acción no se puede deshacer.`)) {
    deleteTableMutation.mutate(tableId)
  }
}
</script>

<template>
  <div class="p-6 space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-[#111827]">Egresos</h1>
          <p class="text-[#6b7280]">Gestiona tus categorías de gastos</p>
        </div>
        <div class="flex gap-3">
          <Button variant="secondary" @click="showEditCategoriesModal = true">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Editar Categorías
          </Button>
          <Button variant="secondary" @click="showAddCategoryModal = true">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Agregar Categoría
          </Button>
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card class="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardHeader>
            <CardTitle class="text-lg font-medium text-red-900">Total Egresos</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="text-3xl font-bold text-red-900">{{ currency }}{{ totalExpenses.toFixed(2) }}</div>
            <p class="text-sm text-red-700 mt-2">{{ tables?.length || 0 }} categorías</p>
          </CardContent>
        </Card>

        <Card class="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader>
            <CardTitle class="text-lg font-medium text-orange-900">Promedio por Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="text-3xl font-bold text-orange-900">{{ currency }}{{ averageExpense.toFixed(2) }}</div>
            <p class="text-sm text-orange-700 mt-2">Gasto promedio</p>
          </CardContent>
        </Card>

        <Card class="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardHeader>
            <CardTitle class="text-lg font-medium text-yellow-900">Categoría Mayor</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="text-3xl font-bold text-yellow-900">{{ currency }}{{ highestCategory.amount.toFixed(2) }}</div>
            <p class="text-sm text-yellow-700 mt-2">{{ highestCategory.name }}</p>
          </CardContent>
        </Card>
      </div>

      <!-- Charts Section -->
      <div class="space-y-6">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Expense Distribution Pie Chart -->
          <Card class="lg:col-span-1">
            <CardHeader>
              <CardTitle class="text-lg">Distribución de Egresos</CardTitle>
              <CardDescription>Proporción por categoría</CardDescription>
            </CardHeader>
            <CardContent>
              <PieChart :data="expenseDistributionData" />
            </CardContent>
          </Card>

          <!-- Expense Trend Line Chart -->
          <Card class="lg:col-span-2">
            <CardHeader>
              <CardTitle class="text-lg">Tendencia de Egresos</CardTitle>
              <CardDescription>Evolución en los últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <LineChart :data="expenseTrendData" />
            </CardContent>
          </Card>
        </div>

        <!-- Category Comparison Bar Chart -->
        <Card>
          <CardHeader>
            <CardTitle class="text-lg">Comparación de Categorías</CardTitle>
            <CardDescription>Gastos por categoría</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart :data="categoryComparisonData" />
          </CardContent>
        </Card>
      </div>

      <!-- Add Category Modal -->
      <div v-if="showAddCategoryModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 class="text-lg font-semibold text-[#111827] mb-4">Agregar Nueva Categoría</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-[#111827] mb-1">Nombre de la categoría</label>
              <input
                v-model="newTableName"
                type="text"
                class="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009ef7] focus:border-transparent"
                placeholder="Ej: Gastos Personales"
              />
            </div>
            <div v-if="addTableError" class="text-sm text-red-600">
              {{ addTableError }}
            </div>
          </div>
          <div class="flex justify-end gap-3 mt-6">
            <Button variant="secondary" @click="showAddCategoryModal = false">
              Cancelar
            </Button>
            <Button 
              variant="primary" 
              @click="addTable"
              :disabled="addTableMutation.isPending.value"
            >
              {{ addTableMutation.isPending.value ? 'Creando...' : 'Agregar' }}
            </Button>
          </div>
        </div>
      </div>

      <!-- Edit Categories Modal -->
      <div v-if="showEditCategoriesModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
          <h3 class="text-lg font-semibold text-[#111827] mb-4">Editar Categorías</h3>
          <div class="space-y-4">
            <div v-for="table in tables" :key="table.id" class="border border-[#e5e7eb] rounded-lg p-4">
              <div class="flex items-center justify-between mb-3">
                <h4 class="font-medium text-[#111827]">{{ table.name }}</h4>
                <Button 
                  variant="danger" 
                  size="sm"
                  @click="deleteTable(table.id)"
                  class="text-red-600 hover:bg-red-50"
                >
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0118 21H6a2 2 0 01-2-2V5a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-.867 1.414z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11v6m0 0l3-3m-3 0l3 3m-3-6h6"></path>
                  </svg>
                  Eliminar
                </Button>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-[#111827] mb-1">Nombre</label>
                  <input
                    :value="getEditTableValue(table.id, 'name')"
                    @input="setEditTableValue(table.id, 'name', $event)"
                    type="text"
                    class="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009ef7] focus:border-transparent"
                    placeholder="Nombre de la categoría"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-[#111827] mb-1">Descripción</label>
                  <input
                    :value="getEditTableValue(table.id, 'description')"
                    @input="setEditTableValue(table.id, 'description', $event)"
                    type="text"
                    class="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009ef7] focus:border-transparent"
                    placeholder="Descripción"
                  />
                </div>
              </div>
              <div class="flex justify-end gap-3 mt-3">
                <Button variant="secondary" @click="cancelEditTable(table.id)">
                  Cancelar
                </Button>
                <Button variant="primary" @click="saveEditTable(table.id)">
                  Guardar
                </Button>
              </div>
            </div>
          </div>
          <div class="flex justify-end mt-6">
            <Button variant="secondary" @click="showEditCategoriesModal = false">
              Cerrar
            </Button>
          </div>
        </div>
      </div>
    </div>
</template>
