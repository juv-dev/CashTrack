<template>
  <div class="p-4 sm:p-6 lg:p-8">
    <div v-if="isDeudasMain">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Deudas de Tarjeta</h1>
        <p class="text-gray-600 mt-2">Gestiona tus deudas de tarjeta de crédito</p>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="bg-gradient-to-r from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-red-800">Total Deuda</h3>
              <p class="text-sm text-red-600">Monto total pendiente</p>
            </div>
            <div class="bg-red-200 rounded-full p-3">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
              </svg>
            </div>
          </div>
          <p class="text-2xl font-bold text-red-700 mt-4">S/. {{ totalDebt.toFixed(2) }}</p>
        </div>

        <div class="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl p-6 border border-yellow-200">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-yellow-800">Pendientes</h3>
              <p class="text-sm text-yellow-600">Deudas sin pagar</p>
            </div>
            <div class="bg-yellow-200 rounded-full p-3">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
          <p class="text-2xl font-bold text-yellow-700 mt-4">{{ pendingDebts.length }}</p>
        </div>

        <div class="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-orange-800">Parciales</h3>
              <p class="text-sm text-orange-600">Pagos parciales</p>
            </div>
            <div class="bg-orange-200 rounded-full p-3">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
          <p class="text-2xl font-bold text-orange-700 mt-4">{{ partialDebts.length }}</p>
        </div>
      </div>

      <!-- Add Debt Button -->
      <div class="mb-6">
        <button
          @click="showAddModal = true"
          class="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Agregar Deuda
        </button>
      </div>

      <!-- Debts List -->
      <div class="bg-white rounded-xl shadow-lg overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-medium text-gray-900">Lista de Deudas</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cuotas</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Pago</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="debt in debts" :key="debt.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ debt.description }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">S/. {{ debt.amount.toFixed(2) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ debt.paidInstallments }}/{{ debt.totalInstallments }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ formatDate(debt.dueDate) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClass(debt.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ getStatusLabel(debt.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    @click="openPaymentModal(debt)"
                    class="text-red-600 hover:text-red-900 mr-3"
                    title="Pagar"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                  </button>
                  <button
                    @click="deleteDebt(debt.id)"
                    class="text-gray-600 hover:text-gray-900"
                    title="Eliminar"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-if="debts.length === 0" class="text-center py-8">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">No hay deudas registradas</h3>
            <p class="mt-1 text-sm text-gray-500">Comienza agregando tu primera deuda</p>
          </div>
        </div>
      </div>

      <!-- Navigation to History -->
      <div class="mt-6 text-center">
        <router-link
          to="/deudas/historial"
          class="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          Ver Historial de Pagos
        </router-link>
      </div>
    </div>

    <!-- Add Debt Modal -->
    <transition v-if="isDeudasMain" name="modal-fade">
      <div
        v-if="showAddModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        @click.self="showAddModal = false"
      >
        <div class="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl transform transition-all duration-300 ease-out scale-95 hover:scale-100">
          <!-- Modal Header -->
          <div class="bg-gradient-to-r from-red-600 to-red-700 px-8 py-6">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-2xl font-bold text-white">Nueva Deuda</h2>
                <p class="text-red-100 text-sm mt-1">Ingresa los detalles de la deuda</p>
              </div>
              <button
                @click="showAddModal = false"
                class="text-white hover:text-red-200 transition-colors"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Modal Body -->
          <div class="p-8">
            <form @submit.prevent="addNewDebt" class="space-y-6">
              <div class="space-y-5">
                <!-- Description Field -->
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                  </div>
                  <input
                    v-model="newDebt.description"
                    type="text"
                    required
                    class="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-2 focus:ring-red-200 transition duration-150 ease-in-out py-3"
                    placeholder="Ej: Compra en tienda"
                  />
                </div>

                <!-- Amount Field -->
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span class="text-gray-500 font-medium">S/.</span>
                  </div>
                  <input
                    v-model="newDebt.amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    class="pl-12 block w-full rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-2 focus:ring-red-200 transition duration-150 ease-in-out py-3"
                    placeholder="0.00"
                  />
                </div>

                <!-- Installments Field -->
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                    </svg>
                  </div>
                  <input
                    v-model="newDebt.totalInstallments"
                    type="number"
                    required
                    min="1"
                    class="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-2 focus:ring-red-200 transition duration-150 ease-in-out py-3"
                    placeholder="Número de cuotas"
                  />
                </div>

                <!-- Due Date Field -->
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <input
                    v-model="newDebt.dueDate"
                    type="date"
                    required
                    class="pl-10 block w-full rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-2 focus:ring-red-200 transition duration-150 ease-in-out py-3 cursor-pointer"
                  />
                </div>
              </div>

              <!-- Buttons -->
              <div class="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  @click="showAddModal = false"
                  class="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  class="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 rounded-lg hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                  Agregar Deuda
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </transition>

    <!-- Payment Modal -->
    <div
      v-if="isDeudasMain && showPaymentModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Pagar Deuda</h2>
        <div class="mb-4">
          <p class="text-sm text-gray-600">Deuda: {{ selectedDebt?.description }}</p>
          <p class="text-sm text-gray-600">Monto: S/. {{ selectedDebt?.amount.toFixed(2) }}</p>
          <p class="text-sm text-gray-600">Cuotas: {{ selectedDebt?.paidInstallments }}/{{ selectedDebt?.totalInstallments }}</p>
        </div>
        <form @submit.prevent="processPayment">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Cuotas a Pagar</label>
              <input
                v-model="paymentInstallments"
                type="number"
                required
                min="1"
                :max="(selectedDebt?.totalInstallments || 0) - (selectedDebt?.paidInstallments || 0)"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                placeholder="1"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Estado del Pago</label>
              <select
                v-model="paymentStatus"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              >
                <option value="partial">Parcialmente Pagado</option>
                <option value="paid">Totalmente Pagado</option>
              </select>
            </div>
          </div>
          <div class="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              @click="showPaymentModal = false"
              class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Procesar Pago
            </button>
          </div>
        </form>
      </div>
    </div>
    <!-- Show Historial when viewing child route -->
    <router-view v-else></router-view>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useDeudas } from '../composables/useDeudas'
import type { CreditCardDebt } from '~/shared/types'

const route = useRoute()
const { debts, totalDebt, pendingDebts, partialDebts, initialize, addDebt, updateDebtStatus, deleteDebt } = useDeudas()

// Computed property to check if we're on the main deudas page
const isDeudasMain = computed(() => route.path === '/deudas' || route.path === '/deudas/')


// Modal state
const showAddModal = ref(false)
const showPaymentModal = ref(false)
const selectedDebt = ref<CreditCardDebt | null>(null)

// Form state
const newDebt = ref({
  description: '',
  amount: 0,
  totalInstallments: 1,
  dueDate: ''
})

const paymentInstallments = ref(1)
const paymentStatus = ref<'partial' | 'paid'>('partial')

// Initialize
onMounted(() => {
  initialize()
})

// Methods
const addNewDebt = () => {
  addDebt({
    ...newDebt.value,
    paidInstallments: 0,
    status: 'pending'
  })
  
  // Reset form
  newDebt.value = {
    description: '',
    amount: 0,
    totalInstallments: 1,
    dueDate: ''
  }
  showAddModal.value = false
}

const openPaymentModal = (debt: CreditCardDebt) => {
  selectedDebt.value = debt
  paymentInstallments.value = 1
  paymentStatus.value = 'partial'
  showPaymentModal.value = true
}

const processPayment = () => {
  if (!selectedDebt.value) return
  
  const newPaidInstallments = selectedDebt.value.paidInstallments + paymentInstallments.value
  updateDebtStatus(selectedDebt.value.id, paymentStatus.value, newPaidInstallments)
  
  showPaymentModal.value = false
  selectedDebt.value = null
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES')
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'partial':
      return 'bg-orange-100 text-orange-800'
    case 'paid':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'pending':
      return 'Pendiente'
    case 'partial':
      return 'Parcial'
    case 'paid':
      return 'Pagado'
    default:
      return 'Desconocido'
  }
}
</script>
