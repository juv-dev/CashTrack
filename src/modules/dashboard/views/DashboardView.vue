<script setup>
import { computed, ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter, useRoute } from 'vue-router'

// Datos de ejemplo
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// Datos de ejemplo
const totalIncome = ref(12500)
const remainingBudget = ref(8430)
const remainingPerPerson = computed(() => (totalIncome.value - remainingBudget.value) / 2)
const currency = ref('S/')
const isAdmin = computed(() => authStore.user?.role === 'admin')

// Verificar si es la ruta principal de dashboard
const isDashboardMain = computed(() => route.path === '/dashboard' || route.path === '/dashboard/')

// Verificar autenticación
onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
  }
})
</script>

<template>
  <!-- Mostrar dashboard principal solo si es la ruta /dashboard -->
  <div v-if="isDashboardMain" class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-[#1F2933]">Bienvenido de vuelta, {{ authStore.user?.name || 'Usuario' }} 👋</h1>
        <p class="text-[#6B7280]">Aquí tienes un resumen de tus finanzas</p>
      </div>
      <div class="flex items-center space-x-4">
        <button class="px-4 py-2 bg-[#6B8E23] text-white rounded-lg hover:bg-[#5A7A1F] transition-colors">
          Generar reporte
        </button>
      </div>
    </div>

    <!-- Cards de resumen -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Tarjeta de Ingresos -->
      <div class="bg-white rounded-xl p-6 shadow-sm border border-[#E5E7EB]">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[#6B7280] text-sm">Ingresos totales</p>
            <p class="text-2xl font-bold text-[#1F2933] mt-1">{{ currency }}{{ totalIncome.toFixed(2) }}</p>
            <p class="text-sm text-green-600 mt-2 flex items-center">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
              </svg>
              +12% desde el mes pasado
            </p>
          </div>
          <div class="p-3 bg-[#ECFDF5] rounded-lg">
            <svg class="w-6 h-6 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- Tarjeta de Gastos -->
      <div class="bg-white rounded-xl p-6 shadow-sm border border-[#E5E7EB]">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[#6B7280] text-sm">Gastos totales</p>
            <p class="text-2xl font-bold text-[#1F2933] mt-1">{{ currency }}{{ (totalIncome - remainingBudget).toFixed(2) }}</p>
            <p class="text-sm text-red-600 mt-2 flex items-center">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
              -8% desde el mes pasado
            </p>
          </div>
          <div class="p-3 bg-[#FEF2F2] rounded-lg">
            <svg class="w-6 h-6 text-[#EF4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- Tarjeta de Balance -->
      <div class="bg-white rounded-xl p-6 shadow-sm border border-[#E5E7EB]">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[#6B7280] text-sm">Balance actual</p>
            <p class="text-2xl font-bold text-[#1F2933] mt-1">{{ currency }}{{ remainingBudget.toFixed(2) }}</p>
            <p class="text-sm text-green-600 mt-2 flex items-center">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
              </svg>
              +4% desde el mes pasado
            </p>
          </div>
          <div class="p-3 bg-[#EFF6FF] rounded-lg">
            <svg class="w-6 h-6 text-[#3B82F6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Cards -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div class="space-y-6">
        <h2 class="text-2xl font-bold text-[#1F2933]">ACCIONES PRINCIPALES</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <router-link to="/planificacion" class="bg-white rounded-2xl p-8 border border-[#C9B27C]/30 hover:shadow-lg transition-all">
            <div class="flex flex-col items-center text-center">
              <div class="w-16 h-16 bg-[#6B8E23] rounded-2xl flex items-center justify-center mb-4">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                </svg>
              </div>
              <h3 class="font-bold text-[#1F2933] mb-2">PLANIFICACIÓN</h3>
              <p class="text-[#C9B27C] text-sm">Control estratégico</p>
            </div>
          </router-link>
          <router-link to="/dashboard/ingresos" class="bg-white rounded-2xl p-8 border border-[#C9B27C]/30 hover:shadow-lg transition-all">
            <div class="flex flex-col items-center text-center">
              <div class="w-16 h-16 bg-[#6B8E23] rounded-2xl flex items-center justify-center mb-4">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 class="font-bold text-[#1F2933] mb-2">INGRESOS</h3>
              <p class="text-[#C9B27C] text-sm">Flujo natural</p>
            </div>
          </router-link>
        </div>
      </div>
      <div class="space-y-6">
        <h2 class="text-2xl font-bold text-[#1F2933]">CONTROL FINANCIERO</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <router-link to="/dashboard/egresos" class="bg-white rounded-2xl p-8 border border-[#C9B27C]/30 hover:shadow-lg transition-all">
            <div class="flex flex-col items-center text-center">
              <div class="w-16 h-16 bg-[#6B8E23] rounded-2xl flex items-center justify-center mb-4">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <h3 class="font-bold text-[#1F2933] mb-2">EGRESOS</h3>
              <p class="text-[#C9B27C] text-sm">Control preciso</p>
            </div>
          </router-link>
          <router-link v-if="!isAdmin" to="/deudas" class="bg-white rounded-2xl p-8 border border-[#C9B27C]/30 hover:shadow-lg transition-all">
            <div class="flex flex-col items-center text-center">
              <div class="w-16 h-16 bg-[#6B8E23] rounded-2xl flex items-center justify-center mb-4">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                </svg>
              </div>
              <h3 class="font-bold text-[#1F2933] mb-2">DEUDAS</h3>
              <p class="text-[#C9B27C] text-sm">Dominio total</p>
            </div>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Sección de Transacciones Recientes -->
    <div class="bg-white rounded-xl p-6 shadow-sm border border-[#E5E7EB]">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-lg font-semibold text-[#1F2933]">Transacciones recientes</h2>
        <button class="text-[#6B8E23] text-sm font-medium hover:text-[#5A7A1F]">Ver todas</button>
      </div>
      
      <div class="space-y-4">
        <!-- Transacción 1 -->
        <div class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
          <div class="flex items-center space-x-3">
            <div class="p-2 bg-green-100 rounded-lg">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <p class="font-medium text-[#1F2933]">Pago de cliente</p>
              <p class="text-sm text-[#6B7280]">Hace 5 minutos</p>
            </div>
          </div>
          <div class="text-right">
            <p class="font-medium text-green-600">+S/ 1,250.00</p>
            <p class="text-sm text-[#6B7280]">Cuenta principal</p>
          </div>
        </div>

        <!-- Transacción 2 -->
        <div class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
          <div class="flex items-center space-x-3">
            <div class="p-2 bg-red-100 rounded-lg">
              <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
            </div>
            <div>
              <p class="font-medium text-[#1F2933]">Compra en supermercado</p>
              <p class="text-sm text-[#6B7280]">Hace 2 horas</p>
            </div>
          </div>
          <div class="text-right">
            <p class="font-medium text-red-600">-S/ 187.50</p>
            <p class="text-sm text-[#6B7280]">Tarjeta de crédito</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Gráficos y estadísticas -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Gráfico de ingresos vs gastos -->
      <div class="bg-white rounded-xl p-6 shadow-sm border border-[#E5E7EB]">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-[#1F2933]">Ingresos vs Gastos</h2>
          <select class="text-sm border border-[#E5E7EB] rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#6B8E23] focus:border-transparent">
            <option>Este mes</option>
            <option>Mes pasado</option>
            <option>Últimos 3 meses</option>
            <option>Este año</option>
          </select>
        </div>
        <div class="h-64 flex items-center justify-center text-gray-400">
          [Gráfico de barras se mostrará aquí]
        </div>
      </div>

      <!-- Categorías de gastos -->
      <div class="bg-white rounded-xl p-6 shadow-sm border border-[#E5E7EB]">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-[#1F2933]">Gastos por categoría</h2>
          <button class="text-[#6B8E23] text-sm font-medium hover:text-[#5A7A1F]">Ver detalles</button>
        </div>
        <div class="space-y-4">
          <!-- Categoría 1 -->
          <div>
            <div class="flex justify-between text-sm mb-1">
              <span class="font-medium">Comida</span>
              <span>35%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="bg-[#6B8E23] h-2 rounded-full" style="width: 35%"></div>
            </div>
          </div>
          
          <!-- Categoría 2 -->
          <div>
            <div class="flex justify-between text-sm mb-1">
              <span class="font-medium">Transporte</span>
              <span>25%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="bg-[#8A6A4F] h-2 rounded-full" style="width: 25%"></div>
            </div>
          </div>
          
          <!-- Categoría 3 -->
          <div>
            <div class="flex justify-between text-sm mb-1">
              <span class="font-medium">Entretenimiento</span>
              <span>15%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="bg-[#C9B27C] h-2 rounded-full" style="width: 15%"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Mostrar vistas anidadas para ingresos/egresos -->
  <router-view v-else></router-view>
</template>
