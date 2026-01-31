<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components'
import { PieChart, LineChart, BarChart } from '@/shared/components'

const authStore = useAuthStore()

// State for salaries
const salaries = ref([
  { id: '1', name: 'Sueldo 1', amount: 5200 },
  { id: '2', name: 'Sueldo 2', amount: 600 }
])

// State for modals
const showAddSalaryModal = ref(false)
const showEditSalariesModal = ref(false)
const newSalaryName = ref('')
const newSalaryAmount = ref('')

const editSalaryValues = ref<Record<string, { name: string, amount: string }>>({})

// Salary chart data
const salaryDistributionData = computed(() => {
  if (!salaries.value || salaries.value.length === 0) {
    return {
      labels: ['Sin datos'],
      datasets: [{
        data: [1],
        backgroundColor: ['#e5e7eb']
      }]
    }
  }

  return {
    labels: salaries.value.map(salary => salary.name),
    datasets: [{
      data: salaries.value.map(salary => salary.amount),
      backgroundColor: salaries.value.map((_, index) => {
        const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']
        return colors[index % colors.length]
      })
    }]
  }
})

const salaryTrendData = computed(() => {
  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio']
  
  if (!salaries.value || salaries.value.length === 0) {
    return {
      labels: months,
      datasets: [{
        label: 'Ingresos',
        data: [0, 0, 0, 0, 0, 0],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4
      }]
    }
  }

  const baseAmount = totalIncome.value
  const trendData = months.map((_, index) => {
    const variation = Math.sin(index * 0.3) * 100 + Math.random() * 50
    return Math.max(0, baseAmount + variation)
  })

  return {
    labels: months,
    datasets: [{
      label: 'Ingresos Mensuales',
      data: trendData,
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      tension: 0.4,
      fill: true
    }]
  }
})

const salaryComparisonData = computed(() => {
  if (!salaries.value || salaries.value.length === 0) {
    return {
      labels: ['Sin datos'],
      datasets: [{
        label: 'Sueldos',
        data: [0],
        backgroundColor: ['#e5e7eb']
      }]
    }
  }

  return {
    labels: salaries.value.map(salary => salary.name),
    datasets: [{
      label: 'Monto Actual',
      data: salaries.value.map(salary => salary.amount),
      backgroundColor: salaries.value.map((_, index) => {
        const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']
        return colors[index % colors.length]
      })
    }]
  }
})

// Calculate total income
const totalIncome = computed(() => {
  return salaries.value.reduce((sum, salary) => sum + salary.amount, 0)
})

const currency = computed(() => 'S/')

// Load salaries from localStorage
const loadSalariesFromStorage = () => {
  if (!authStore.user) {
    salaries.value = getDefaultSalaries()
    return
  }
  
  const storageKey = `salaries-${authStore.user.id}`
  const stored = localStorage.getItem(storageKey)
  if (stored) {
    try {
      salaries.value = JSON.parse(stored)
    } catch (e) {
      console.error('Error loading salaries from localStorage:', e)
      salaries.value = getDefaultSalaries()
    }
  } else {
    salaries.value = getDefaultSalaries()
  }
}

// Save salaries to localStorage
const saveSalariesToStorage = () => {
  if (!authStore.user) return
  
  const storageKey = `salaries-${authStore.user.id}`
  localStorage.setItem(storageKey, JSON.stringify(salaries.value))
}

const getDefaultSalaries = () => [
  { id: '1', name: 'Sueldo 1', amount: 5200 },
  { id: '2', name: 'Sueldo 2', amount: 600 }
]

// Initialize edit values when salaries change
watch(() => salaries.value, (newSalaries) => {
  newSalaries.forEach(salary => {
    if (!editSalaryValues.value[salary.id]) {
      editSalaryValues.value[salary.id] = {
        name: salary.name,
        amount: salary.amount.toString()
      }
    }
  })
}, { immediate: true })

// CRUD functions
const addSalary = () => {
  if (!newSalaryName.value.trim() || !newSalaryAmount.value) return

  const newSalary = {
    id: Date.now().toString(),
    name: newSalaryName.value.trim(),
    amount: parseFloat(newSalaryAmount.value)
  }

  salaries.value.push(newSalary)
  saveSalariesToStorage()

  newSalaryName.value = ''
  newSalaryAmount.value = ''
  showAddSalaryModal.value = false
}

const saveEditSalary = (salaryId: string) => {
  const values = editSalaryValues.value[salaryId]
  if (!values) return
  
  const amount = parseFloat(values.amount)
  if (isNaN(amount) || amount <= 0) return
  
  const salary = salaries.value.find(s => s.id === salaryId)
  if (salary) {
    salary.name = values.name.trim()
    salary.amount = amount
    saveSalariesToStorage()
  }
}

const cancelEditSalary = (salaryId?: string) => {
  if (salaryId) {
    delete editSalaryValues.value[salaryId]
  }
}

const deleteSalary = (salaryId: string) => {
  if (confirm('¿Estás seguro de eliminar este sueldo? Esta acción no se puede deshacer.')) {
    salaries.value = salaries.value.filter(s => s.id !== salaryId)
    saveSalariesToStorage()
  }
}

// Load data on component mount
onMounted(() => {
  loadSalariesFromStorage()
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Ingresos</h1>
        <p class="text-sm text-gray-500">Gestiona tus fuentes de ingresos</p>
      </div>
      <div class="flex gap-3">
        <Button variant="outline" @click="showEditSalariesModal = true">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Editar Sueldos
        </Button>
        <Button @click="showAddSalaryModal = true">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Agregar Sueldo
          </Button>
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card class="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader>
            <CardTitle class="text-lg font-medium text-green-900">Total Ingresos</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="text-3xl font-bold text-green-900">{{ currency }}{{ totalIncome.toFixed(2) }}</div>
            <p class="text-sm text-green-700 mt-2">{{ salaries.length }} fuentes de ingresos</p>
          </CardContent>
        </Card>

        <Card class="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader>
            <CardTitle class="text-lg font-medium text-blue-900">Promedio Mensual</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="text-3xl font-bold text-blue-900">{{ currency }}{{ (totalIncome / salaries.length).toFixed(2) }}</div>
            <p class="text-sm text-blue-700 mt-2">Por fuente de ingreso</p>
          </CardContent>
        </Card>

        <Card class="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader>
            <CardTitle class="text-lg font-medium text-purple-900">Ingreso Principal</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="text-3xl font-bold text-purple-900">{{ currency }}{{ Math.max(...salaries.map(s => s.amount)).toFixed(2) }}</div>
            <p class="text-sm text-purple-700 mt-2">Fuente mayor</p>
          </CardContent>
        </Card>
      </div>

      <!-- Charts Section -->
      <div class="space-y-6">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Salary Distribution Pie Chart -->
          <Card class="lg:col-span-1">
            <CardHeader>
              <CardTitle class="text-lg">Distribución de Ingresos</CardTitle>
              <CardDescription>Proporción de cada fuente</CardDescription>
            </CardHeader>
            <CardContent>
              <PieChart :data="salaryDistributionData" />
            </CardContent>
          </Card>

          <!-- Salary Trend Line Chart -->
          <Card class="lg:col-span-2">
            <CardHeader>
              <CardTitle class="text-lg">Tendencia de Ingresos</CardTitle>
              <CardDescription>Evolución en los últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <LineChart :data="salaryTrendData" />
            </CardContent>
          </Card>
        </div>

        <!-- Salary Comparison Bar Chart -->
        <Card>
          <CardHeader>
            <CardTitle class="text-lg">Comparación de Ingresos</CardTitle>
            <CardDescription>Visualización comparativa de montos</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart :data="salaryComparisonData" />
          </CardContent>
        </Card>
      </div>

      <!-- Add Salary Modal -->
      <div v-if="showAddSalaryModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 class="text-lg font-semibold text-[#111827] mb-4">Agregar Nuevo Ingreso</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-[#111827] mb-1">Nombre del ingreso</label>
              <input
                v-model="newSalaryName"
                type="text"
                class="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009ef7] focus:border-transparent"
                placeholder="Ej: Sueldo Principal"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-[#111827] mb-1">Monto</label>
              <input
                v-model="newSalaryAmount"
                type="number"
                class="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009ef7] focus:border-transparent"
                placeholder="0.00"
              />
            </div>
          </div>
          <div class="flex justify-end gap-3 mt-6">
            <Button variant="secondary" @click="showAddSalaryModal = false">
              Cancelar
            </Button>
            <Button variant="primary" @click="addSalary">
              Agregar
            </Button>
          </div>
        </div>
      </div>

      <!-- Edit Salaries Modal -->
      <div v-if="showEditSalariesModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
          <h3 class="text-lg font-semibold text-[#111827] mb-4">Editar Ingresos</h3>
          <div class="space-y-4">
            <div v-for="salary in salaries" :key="salary.id" class="border border-[#e5e7eb] rounded-lg p-4">
              <div class="flex items-center justify-between mb-3">
                <h4 class="font-medium text-[#111827]">{{ salary.name }}</h4>
                <Button 
                  variant="outline" 
                  size="sm"
                  @click="deleteSalary(salary.id)"
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
                    v-model="editSalaryValues[salary.id].name"
                    type="text"
                    class="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009ef7] focus:border-transparent"
                    placeholder="Nombre del ingreso"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-[#111827] mb-1">Monto</label>
                  <input
                    v-model="editSalaryValues[salary.id].amount"
                    type="number"
                    class="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009ef7] focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div class="flex justify-end gap-3 mt-3">
                <Button variant="secondary" @click="cancelEditSalary(salary.id)">
                  Cancelar
                </Button>
                <Button variant="primary" @click="saveEditSalary(salary.id)">
                  Guardar
                </Button>
              </div>
            </div>
          </div>
          <div class="flex justify-end mt-6">
            <Button variant="secondary" @click="showEditSalariesModal = false">
              Cerrar
            </Button>
          </div>
        </div>
      </div>
    </div>
</template>
