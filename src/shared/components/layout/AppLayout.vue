<script setup lang="ts">
import { ref, computed, h, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import { Button } from '~/shared/components'
import { useBudgets } from '~/modules/budget/composables/useBudgets'
import type { NavigationItem, BudgetTable } from '~/shared/types'

// Types

// Router
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { tables, updateTableMutation, deleteTableMutation } = useBudgets()

// State
const isSidebarOpen = ref(false)
const activeCategoryMenu = ref<string | null>(null)
const expandedItems = ref<Set<string>>(new Set()) // Track expanded items

// Computed
const currentRouteName = computed(() => route.name as string)
const currentPath = computed(() => route.path)

// Auto-expand parent items when route changes
watch(currentPath, (newPath) => {
  // Check if current path is a budget category
  if (newPath.startsWith('/budgets/')) {
    expandedItems.value.add('budgets')
  }
  
  // Check if current path is dashboard
  if (newPath === '/dashboard') {
    expandedItems.value.add('dashboard')
  }
  
  // Check if current path is deudas
  if (newPath.startsWith('/deudas')) {
    expandedItems.value.add('deudas')
  }
}, { immediate: true })

// Toggle expanded state for accordion items
const toggleExpanded = (itemName: string) => {
  if (expandedItems.value.has(itemName)) {
    expandedItems.value.delete(itemName)
  } else {
    expandedItems.value.add(itemName)
  }
}

// Static navigation items
const staticNavigationItems: NavigationItem[] = [
  {
    name: 'dashboard',
    label: 'Panel de control',
    component: {
      render() {
        return h('div', {
          class: 'w-5 h-5 flex items-center justify-center',
          innerHTML: `
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
          `
        })
      }
    },
    path: 'dashboard',
    children: [
      {
        name: 'dashboard-main',
        label: 'Resumen',
        component: {
          render() {
            return h('div', {
              class: 'w-4 h-4 flex items-center justify-center',
              innerHTML: `
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
              `
            })
          }
        },
        path: ''
      },
      {
        name: 'ingresos',
        label: 'Ingresos',
        component: {
          render() {
            return h('div', {
              class: 'w-4 h-4 flex items-center justify-center',
              innerHTML: `
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-2c1.11 0 2-.895 2-2s-.89-2-2-2-2 .895-2 2 .89 2 2 2z"/>
                </svg>
              `
            })
          }
        },
        path: 'ingresos'
      },
      {
        name: 'egresos',
        label: 'Egresos',
        component: {
          render() {
            return h('div', {
              class: 'w-4 h-4 flex items-center justify-center',
              innerHTML: `
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
                </svg>
              `
            })
          }
        },
        path: 'egresos'
      }
    ]
  },
  {
    name: 'planificacion',
    label: 'Planificación Mensual',
    component: {
      render() {
        return h('div', {
          class: 'w-5 h-5 flex items-center justify-center',
          innerHTML: `
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
            </svg>
          `
        })
      }
    },
    path: 'planificacion'
  },
  {
    name: 'deudas',
    label: 'Deudas de Tarjeta',
    component: {
      render() {
        return h('div', {
          class: 'w-5 h-5 flex items-center justify-center',
          innerHTML: `
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
            </svg>
          `
        })
      }
    },
    path: 'deudas',
    children: [
      {
        name: 'deudas-main',
        label: 'Resumen',
        component: {
          render() {
            return h('div', {
              class: 'w-4 h-4 flex items-center justify-center',
              innerHTML: `
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                </svg>
              `
            })
          }
        },
        path: ''
      },
      {
        name: 'deudas-historial',
        label: 'Historial',
        component: {
          render() {
            return h('div', {
              class: 'w-4 h-4 flex items-center justify-center',
              innerHTML: `
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v4m5-6h4m-4 6h6m-6 4h8m0 0h2a2 2 0 002-2v-4a2 2 0 00-2-2h-2"></path>
                </svg>
              `
            })
          }
        },
        path: 'historial'
      }
    ]
  }
]

// Dynamic navigation items
const dynamicNavigationItems = computed((): NavigationItem[] => {
  const items: NavigationItem[] = []
  
  return items
})

// Dynamic budgets navigation
const budgetsNavigationItem = computed((): NavigationItem => {
  const budgetTables = (tables && 'value' in tables) ? (tables.value as BudgetTable[] || []) : []
  
  return {
    name: 'budgets',
    label: 'Presupuestos',
    component: {
      render() {
        return h('div', {
          class: 'w-5 h-5 flex items-center justify-center',
          innerHTML: `
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
            </svg>
          `
        })
      }
    },
    path: 'budgets',
    children: (budgetTables || []).map((table: BudgetTable) => ({
      name: `budget-category-${table.id}`,
      label: table.name,
      component: {
        render() {
          return h('div', {
            class: 'w-4 h-4 flex items-center justify-center',
            innerHTML: `
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
              </svg>
            `
          })
        }
      },
      path: table.id
    }))
  }
})

// Combine all navigation items
const navigationItems = computed(() => [
  ...staticNavigationItems,
  ...dynamicNavigationItems.value,
  budgetsNavigationItem.value
])

const navigateTo = (path: string) => {
  // If path doesn't start with '/', add it
  const fullPath = path.startsWith('/') ? path : `/${path}`
  router.push(fullPath)
  isSidebarOpen.value = false
}

const navigateToChild = (parentPath: string, childPath: string) => {
  router.push(`/${parentPath}/${childPath}`)
  isSidebarOpen.value = false
}

const handleLogout = () => {
  if (confirm('¿Estás seguro de cerrar sesión?')) {
    authStore.logout()
  }
}

// Category menu functions
const toggleCategoryMenu = (category: any) => {
  console.log('toggleCategoryMenu called with:', category)
  console.log('activeCategoryMenu before:', activeCategoryMenu.value)
  activeCategoryMenu.value = activeCategoryMenu.value === category.path ? null : category.path
  console.log('activeCategoryMenu after:', activeCategoryMenu.value)
}

const editCategory = (category: any) => {
  const newName = prompt('Editar nombre de la categoría:', category.label)
  if (newName && newName.trim() && newName !== category.label) {
    const tableId = category.path.split('/').pop()
    updateTableMutation.mutate({
      tableId,
      updates: { name: newName.trim() }
    })
  }
  activeCategoryMenu.value = null
}

const deleteCategory = (category: any) => {
  if (confirm(`¿Estás seguro de eliminar la categoría "${category.label}"? Esta acción no se puede deshacer.`)) {
    const tableId = category.path.split('/').pop()
    deleteTableMutation.mutate(tableId)
  }
  activeCategoryMenu.value = null
}

// Close menu when clicking outside
document.addEventListener('click', () => {
  activeCategoryMenu.value = null
})

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}
</script>

<template>
  <div class="flex h-screen bg-[#0F172A]">
    <!-- Mobile Sidebar Overlay -->
    <div 
      v-if="isSidebarOpen" 
      class="fixed inset-0 z-50 bg-black/50 transition-opacity lg:hidden"
      @click="toggleSidebar"
    ></div>

    <!-- Sidebar -->
    <aside 
      :class="`
        fixed inset-y-0 left-0 z-40 w-72 bg-[#0F172A] border-r border-[#1E293B] transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `"
    >
      <div class="flex h-full flex-col">
        <!-- Logo -->
        <div class="flex h-16 items-center px-6 border-b border-[#1E293B]">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-[#06B6D4] rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <h1 class="text-lg font-semibold text-white">CashTrack</h1>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <div class="space-y-1">
            <h3 class="px-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Menú</h3>
            <ul class="space-y-1">
              <li v-for="item in navigationItems" :key="item.name">
                <!-- Parent Item -->
                <button
                  :class="`
                    w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors
                    ${item.children && item.children.some(child => currentPath === child.path || (child.path && currentPath.startsWith(child.path)))
                      ? 'bg-[#06B6D4] text-white' 
                      : 'text-[#CBD5E1] hover:text-white'
                    }
                  `"
                  @click="item.children ? toggleExpanded(item.name) : navigateTo(item.path)"
                >
                  <component :is="item.component" class="w-5 h-5 flex-shrink-0" />
                  <span>{{ item.label }}</span>
                  <!-- Chevron for accordion items -->
                  <svg 
                    v-if="item.children" 
                    :class="`
                      w-4 h-4 ml-auto transition-transform duration-200
                      ${expandedItems.has(item.name) ? 'rotate-90' : ''}
                    `" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
                
                <!-- Children Items -->
                <ul v-if="item.children && (expandedItems.has(item.name) || item.children.some(child => currentPath === ('/' + item.path + '/' + child.path) || currentPath.startsWith('/' + item.path + '/' + child.path)))" class="ml-6 mt-1 space-y-1">
                  <li v-for="child in item.children" :key="child.path" class="group relative">
                    <div class="flex items-center gap-2">
                      <!-- Navigation Button -->
                      <button
                        :class="`
                          w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors
                          ${currentPath === ('/' + item.path + '/' + child.path)
                            ? 'bg-[#06B6D4] text-white' 
                            : 'text-[#CBD5E1] hover:text-white'
                          }
                        `"
                        @click="navigateToChild(item.path, child.path)"
                      >
                        <div class="w-1 h-1 bg-current rounded-full flex-shrink-0"></div>
                        <span>{{ child.label }}</span>
                      </button>
                      
                      <!-- Actions Menu -->
                      <div class="relative">
                        <button
                          class="p-1 rounded hover:bg-[#1E293B] text-[#64748B] hover:text-[#06B6D4]"
                          @click.stop="toggleCategoryMenu(child)"
                        >
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 16v.01"></path>
                          </svg>
                        </button>
                        
                        <!-- Dropdown Menu -->
                        <div
                          v-if="activeCategoryMenu === child.path"
                          class="absolute right-0 top-full mt-1 w-48 bg-[#1E293B] border border-[#334155] rounded-lg shadow-lg z-50"
                        >
                          <div class="py-1">
                            <button
                              class="w-full px-4 py-2 text-left text-sm text-[#E2E8F0] hover:bg-[#0F172A] transition-colors"
                              @click.stop="editCategory(child)"
                            >
                              Editar
                            </button>
                            <button
                              class="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-[#0F172A] transition-colors"
                              @click.stop="deleteCategory(child)"
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </nav>

        <!-- User Section -->
        <div class="border-t border-[#1E293B] p-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-[#06B6D4] rounded-full flex items-center justify-center">
              <span class="text-sm font-medium text-white">{{ authStore.currentUser?.name.charAt(0).toUpperCase() }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-white truncate">{{ authStore.currentUser?.name }}</p>
              <p class="text-xs text-[#64748B] truncate">{{ authStore.currentUser?.email }}</p>
            </div>
            <Button 
              variant="ghost"
              size="sm"
              class="text-[#64748B] hover:text-red-400"
              @click="handleLogout"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Top Bar -->
      <header class="bg-[#1E293B] border-b border-[#0F172A]">
        <div class="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div class="flex items-center gap-4">
            <!-- Mobile Menu Button -->
            <Button 
              variant="ghost"
              size="sm"
              class="lg:hidden text-[#E2E8F0]"
              @click="toggleSidebar"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </Button>
            
            <!-- Page Title -->
            <div>
              <h1 class="text-xl font-semibold text-white">
                {{ navigationItems.find(item => item.name === currentRouteName)?.label || 'CashTrack' }}
              </h1>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <!-- User Avatar (Desktop) -->
            <div class="hidden lg:flex items-center gap-3">
              <div class="w-8 h-8 bg-[#06B6D4] rounded-full flex items-center justify-center">
                <span class="text-sm font-medium text-white">{{ authStore.currentUser?.name.charAt(0).toUpperCase() }}</span>
              </div>
              <span class="text-sm font-medium text-[#E2E8F0]">{{ authStore.currentUser?.name }}</span>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-auto p-4 md:p-6 bg-[#0F172A]">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>
