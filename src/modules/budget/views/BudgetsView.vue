<template>
  <!-- Mostrar presupuestos principales solo si es la ruta /budgets -->
  <div v-if="isBudgetsMain" class="container mx-auto px-4 py-8">
    <!-- Monthly Planning Section -->
    <div class="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-2xl font-semibold text-gray-800">Planificación Mensual</h2>
      </div>
      
      <div class="p-6">
        <!-- Total Budget -->
        <div class="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 mb-8 border border-blue-200 shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-medium text-blue-800">Total de Presupuesto por Persona</h3>
              <p class="text-3xl font-bold text-blue-600 mt-1">S/. {{ formatCurrency(remainingPerPerson) }}</p>
            </div>
            <div class="bg-blue-100 rounded-full p-3">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
          </div>
        </div>
        
        <!-- Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Restante (Remaining) -->
          <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h3 class="text-xl font-bold text-green-800">Restante</h3>
                <p class="text-sm text-green-600">Presupuesto disponible</p>
              </div>
              <div class="bg-green-100 rounded-full p-3">
                <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
            <div class="mt-2">
              <p class="text-3xl font-bold text-green-700">S/. {{ formatCurrency(remainingPerPerson - creditCardDebt) }}</p>
              <div class="mt-3 bg-green-200 rounded-full h-2.5">
                <div 
                  class="bg-green-500 h-2.5 rounded-full transition-all duration-500" 
                  :style="`width: ${Math.max(0, Math.min(((remainingPerPerson - creditCardDebt) / remainingPerPerson) * 100, 100))}%`">
                </div>
              </div>
              <p class="text-xs text-green-600 mt-2">
                {{ Math.max(0, Math.round(((remainingPerPerson - creditCardDebt) / remainingPerPerson) * 100)) }}% del total
              </p>
            </div>
          </div>
          
          <!-- Deuda de Tarjeta -->
          <div class="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h3 class="text-xl font-bold text-red-800">Deuda de Tarjeta</h3>
                <p class="text-sm text-red-600">Saldo pendiente</p>
              </div>
              <div class="bg-red-100 rounded-full p-3">
                <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                </svg>
              </div>
            </div>
            <div class="mt-2">
              <p class="text-3xl font-bold text-red-700">S/. {{ formatCurrency(creditCardDebt) }}</p>
              <div class="mt-3 bg-red-200 rounded-full h-2.5">
                <div 
                  class="bg-red-500 h-2.5 rounded-full transition-all duration-500" 
                  :style="`width: ${Math.min((creditCardDebt / remainingPerPerson) * 100, 100)}%`">
                </div>
              </div>
              <p class="text-xs text-red-600 mt-2">
                {{ Math.round((creditCardDebt / remainingPerPerson) * 100) }}% del total
              </p>
              <router-link
                v-if="!isAdmin"
                to="/deudas"
                class="inline-flex items-center mt-4 text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                </svg>
                Gestionar Deudas
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Mostrar vistas anidadas para categorías específicas -->
  <router-view v-else></router-view>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useAuthStore } from '@/modules/auth/store/auth';
import { useRoute } from 'vue-router';
import { useBudgets } from '@/modules/budget/composables/useBudgets';
import { useDeudas } from '@/modules/deudas/composables/useDeudas';

// Auth store and route
const authStore = useAuthStore();
const route = useRoute();
const isAdmin = computed(() => authStore.user?.role === 'admin');

// Check if we're viewing a specific budget category
const isBudgetsMain = computed(() => route.path === '/budgets' || route.path === '/budgets/' || !route.params.categoryId);

// Get data from composables
const { tables } = useBudgets();
const { totalDebt } = useDeudas();

// State for salaries (same as DashboardView)
const salaries = ref([
  { id: '1', name: 'Sueldo 1', amount: 5200 },
  { id: '2', name: 'Sueldo 2', amount: 600 }
]);

// Load salaries from localStorage for current user
const loadSalariesFromStorage = () => {
  if (!authStore.user) {
    console.warn('No user logged in, using default salaries');
    salaries.value = [
      { id: '1', name: 'Sueldo 1', amount: 5200 },
      { id: '2', name: 'Sueldo 2', amount: 600 }
    ];
    return;
  }
  
  const storageKey = `salaries-${authStore.user.id}`;
  const stored = localStorage.getItem(storageKey);
  if (stored) {
    try {
      salaries.value = JSON.parse(stored);
      console.log(`Loaded ${salaries.value.length} salaries for user ${authStore.user.name}`);
    } catch (e) {
      console.error('Error loading salaries from localStorage:', e);
      salaries.value = [
        { id: '1', name: 'Sueldo 1', amount: 5200 },
        { id: '2', name: 'Sueldo 2', amount: 600 }
      ];
    }
  } else {
    console.log(`No salaries found for user ${authStore.user.name}, using defaults`);
    salaries.value = [
      { id: '1', name: 'Sueldo 1', amount: 5200 },
      { id: '2', name: 'Sueldo 2', amount: 600 }
    ];
  }
};

// Calculate total income (same as DashboardView)
const totalIncome = computed(() => {
  return salaries.value.reduce((sum, salary) => sum + salary.amount, 0);
});

// Calculate remaining budget (sum of all budget categories - same as DashboardView)
const remainingBudget = computed(() => {
  if (!authStore.user) {
    console.log('No user logged in, returning 0');
    return 0;
  }
  
  const tablesData = tables as any;
  if (!tablesData?.value || tablesData.value.length === 0) return 0;
  
  return tablesData.value.reduce((sum: number, table: any) => {
    return sum + table.items.reduce((itemSum: number, item: any) => itemSum + item.amount, 0);
  }, 0);
});

// Calculate remaining per person (same as DashboardView)
const remainingPerPerson = computed(() => {
  return (totalIncome.value - remainingBudget.value) / 2;
});

const creditCardDebt = computed(() => {
  const debtData = totalDebt as any;
  return debtData?.value || 0;
});

// Format currency
const formatCurrency = (value: number) => {
  return value.toFixed(2);
};

// Load data on component mount
onMounted(() => {
  loadSalariesFromStorage();
});

// Watch for user changes to reload salaries
watch(() => authStore.user, (newUser, oldUser) => {
  if (newUser !== oldUser) {
    if (newUser) {
      console.log(`User changed to ${newUser.name}, loading their salaries`);
      loadSalariesFromStorage();
    } else {
      console.log('User logged out, using default salaries');
      salaries.value = [
        { id: '1', name: 'Sueldo 1', amount: 5200 },
        { id: '2', name: 'Sueldo 2', amount: 600 }
      ];
    }
  }
}, { immediate: true });
</script>