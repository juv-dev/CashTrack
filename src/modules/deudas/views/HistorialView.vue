<template>
  <div class="p-4 sm:p-6 lg:p-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Historial de Deudas</h1>
        <p class="text-gray-600 mt-2">Deudas que han sido completamente pagadas</p>
      </div>

      <!-- Back Button -->
      <div class="mb-6">
        <router-link
          to="/deudas"
          class="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Volver a Deudas
        </router-link>
      </div>

      <!-- Summary Card -->
      <div class="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200 mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-green-800">Total Pagado</h3>
            <p class="text-sm text-green-600">Suma total de deudas canceladas</p>
          </div>
          <div class="bg-green-200 rounded-full p-3">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
        <p class="text-2xl font-bold text-green-700 mt-4">S/. {{ totalHistoryDebt.toFixed(2) }}</p>
        <p class="text-sm text-green-600 mt-1">{{ history.length }} deudas pagadas</p>
      </div>

      <!-- History List -->
      <div class="bg-white rounded-xl shadow-lg overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-medium text-gray-900">Historial de Pagos</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cuotas</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Pago</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Creación</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="debt in history" :key="debt.id" class="hover:bg-gray-50">
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
                  <div class="text-sm text-gray-900">{{ formatDate(debt.createdAt) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    Pagado
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-if="history.length === 0" class="text-center py-8">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">No hay deudas pagadas</h3>
            <p class="mt-1 text-sm text-gray-500">Las deudas completamente pagadas aparecerán aquí</p>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useDeudas } from '../composables/useDeudas'

const { history, totalHistoryDebt, initialize } = useDeudas()

// Initialize
onMounted(() => {
  initialize()
})

// Methods
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES')
}
</script>
