<template>
  <div class="p-6 space-y-6">
      <!-- Header Section -->
      <div class="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
        <div class="max-w-4xl mx-auto text-center">
          <div class="mb-6">
            <div class="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
              </svg>
            </div>
            <h1 class="text-4xl font-bold mb-2">Planificación Mensual</h1>
            <p class="text-xl text-indigo-100">Controla tu presupuesto financiero mensual</p>
          </div>
          
          <!-- Main Budget Display -->
          <div class="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
            <div class="text-center">
              <div class="text-5xl font-bold mb-2">S/. {{ formatCurrency(remainingPerPerson) }}</div>
              <div class="text-indigo-100 text-lg">Total de Presupuesto por Persona</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Budget Overview Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Restante Card -->
        <div class="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-8 border border-emerald-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div class="flex flex-col items-center text-center">
            <div class="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mb-4">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-emerald-800 mb-2">Restante</h3>
            <p class="text-emerald-600 mb-4">Presupuesto disponible</p>
            <div class="text-4xl font-bold text-emerald-700 mb-4">S/. {{ formatCurrency(remainingPerPerson - creditCardDebt) }}</div>
            
            <!-- Progress Bar -->
            <div class="w-full bg-emerald-200 rounded-full h-3 mb-2">
              <div 
                class="bg-emerald-500 h-3 rounded-full transition-all duration-500" 
                :style="`width: ${Math.max(0, Math.min(((remainingPerPerson - creditCardDebt) / remainingPerPerson) * 100, 100))}%`">
              </div>
            </div>
            <p class="text-sm text-emerald-600 font-medium">
              {{ Math.max(0, Math.round(((remainingPerPerson - creditCardDebt) / remainingPerPerson) * 100)) }}% del total disponible
            </p>
          </div>
        </div>
        
        <!-- Deuda de Tarjeta Card -->
        <div class="bg-gradient-to-br from-rose-50 to-rose-100 rounded-2xl p-8 border border-rose-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div class="flex flex-col items-center text-center">
            <div class="w-16 h-16 bg-rose-500 rounded-full flex items-center justify-center mb-4">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-rose-800 mb-2">Deuda de Tarjeta</h3>
            <p class="text-rose-600 mb-4">Saldo pendiente</p>
            <div class="text-4xl font-bold text-rose-700 mb-4">S/. {{ formatCurrency(creditCardDebt) }}</div>
            
            <!-- Progress Bar -->
            <div class="w-full bg-rose-200 rounded-full h-3 mb-2">
              <div 
                class="bg-rose-500 h-3 rounded-full transition-all duration-500" 
                :style="`width: ${Math.min((creditCardDebt / remainingPerPerson) * 100, 100)}%`">
              </div>
            </div>
            <p class="text-sm text-rose-600 font-medium">
              {{ Math.round((creditCardDebt / remainingPerPerson) * 100) }}% del presupuesto
            </p>
            
            <!-- Action Button -->
            <router-link
              v-if="!isAdmin"
              to="/deudas"
              class="inline-flex items-center mt-6 px-6 py-3 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors font-medium"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
              </svg>
              Gestionar Deudas
            </router-link>
          </div>
        </div>
      </div>

      <!-- Financial Summary -->
      <div class="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Resumen Financiero</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
            <div class="text-3xl font-bold text-blue-700 mb-2">S/. {{ formatCurrency(remainingPerPerson) }}</div>
            <div class="text-blue-600 font-medium">Presupuesto Total</div>
          </div>
          <div class="text-center p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200">
            <div class="text-3xl font-bold text-emerald-700 mb-2">S/. {{ formatCurrency(remainingPerPerson - creditCardDebt) }}</div>
            <div class="text-emerald-600 font-medium">Disponible</div>
          </div>
          <div class="text-center p-6 bg-gradient-to-br from-rose-50 to-rose-100 rounded-xl border border-rose-200">
            <div class="text-3xl font-bold text-rose-700 mb-2">S/. {{ formatCurrency(creditCardDebt) }}</div>
            <div class="text-rose-600 font-medium">Deuda Actual</div>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useAuthStore } from '~/modules/auth/store/auth';
import { useBudgets } from '~/modules/budget/composables/useBudgets';
import { useDeudas } from '~/modules/deudas/composables/useDeudas';

// Auth store
const authStore = useAuthStore();
const isAdmin = computed(() => authStore.user?.role === 'admin');

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

<style scoped>
/* Add any custom styles here if needed */
</style>
