<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Button } from '~/shared/components'
import { useCategoryLogic } from '~/modules/budget/composables/useCategoryLogic'

// Use category logic composable
const {
  currentCategory,
  isLoading,
  isError,
  error,
  currency,
  showAddItemModal,
  newItemName,
  newItemAmount,
  editingItemId,
  editItemValues,
  addItemMutation,
  updateItemMutation,
  deleteItemMutation,
  startEditItem,
  cancelEditItem,
  saveEditItem,
  deleteItem,
  addItem,
  calculateTableTotal
} = useCategoryLogic()

// Helper function to safely get edit value
const getEditValue = (itemId: string, field: 'name' | 'amount') => {
  return editItemValues.value[itemId]?.[field] || ''
}

// Helper function to safely set edit value
const setEditValue = (itemId: string, field: 'name' | 'amount', event: Event) => {
  const target = event.target as HTMLInputElement
  if (!editItemValues.value[itemId]) {
    editItemValues.value[itemId] = { name: '', amount: '' }
  }
  editItemValues.value[itemId][field] = target.value
}
</script>

<template>
  <div class="p-6 space-y-6">
      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#009ef7]"></div>
        <p class="mt-2 text-[#6b7280]">Cargando categoría...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="isError" class="text-center py-12">
        <div class="text-red-600 mb-4">
          <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-[#111827] mb-2">Error al cargar</h3>
        <p class="text-[#6b7280]">{{ error?.message || 'No se pudo cargar la categoría' }}</p>
      </div>

      <!-- Category Not Found -->
      <div v-else-if="!currentCategory" class="text-center py-12">
        <svg class="mx-auto h-16 w-16 text-[#d1d5db] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="text-lg font-medium text-[#111827] mb-2">Categoría no encontrada</h3>
        <p class="text-[#6b7280]">La categoría que buscas no existe o ha sido eliminada</p>
      </div>

      <!-- Category Content -->
      <div v-else>
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-[#111827]">{{ currentCategory.name }}</h1>
            <p class="text-[#6b7280]">{{ currentCategory.description }}</p>
          </div>
          <div class="text-right">
            <div class="text-sm text-[#6b7280]">Total</div>
            <div class="text-2xl font-bold text-[#111827]">{{ currency }}{{ calculateTableTotal(currentCategory).toFixed(2) }}</div>
          </div>
        </div>

        <!-- Add Item Button -->
        <div class="flex justify-end">
          <Button variant="primary" @click="showAddItemModal = true" class="h-10">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Agregar Item
          </Button>
        </div>

        <!-- Mobile View -->
        <div class="md:hidden space-y-4">
          <div v-if="currentCategory.items.length === 0" class="text-center py-8 text-[#6b7280]">
            <svg class="mx-auto h-10 w-10 text-[#d1d5db] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p class="text-sm">No hay items en esta categoría</p>
            <Button variant="primary" size="sm" @click="showAddItemModal = true" class="mt-2">
              Agregar Primer Item
            </Button>
          </div>

          <div v-else class="space-y-2">
            <div v-for="item in currentCategory.items" :key="item.id" class="bg-white rounded-lg border border-gray-200 p-4">
              <div v-if="editingItemId === item.id" class="space-y-2">
                <input
                  :value="getEditValue(item.id, 'name')"
                  @input="setEditValue(item.id, 'name', $event)"
                  type="text"
                  class="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  placeholder="Nombre"
                />
                <input
                  :value="getEditValue(item.id, 'amount')"
                  @input="setEditValue(item.id, 'amount', $event)"
                  type="number"
                  class="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  placeholder="Monto"
                />
                <div class="flex gap-2">
                  <Button variant="primary" size="sm" @click="saveEditItem(item.id)" :disabled="updateItemMutation.isPending.value">
                    Guardar
                  </Button>
                  <Button variant="secondary" size="sm" @click="cancelEditItem">
                    Cancelar
                  </Button>
                </div>
              </div>
              <div v-else class="flex items-center justify-between">
                <div>
                  <h4 class="font-medium text-gray-900">{{ item.name }}</h4>
                  <p class="text-lg font-bold text-gray-900">{{ currency }}{{ item.amount.toFixed(2) }}</p>
                </div>
                <div class="flex gap-1">
                  <Button variant="secondary" size="sm" @click="startEditItem(item.id)">
                    Editar
                  </Button>
                  <Button variant="danger" size="sm" @click="deleteItem(item.id)" :disabled="deleteItemMutation.isPending.value">
                    Eliminar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Desktop View -->
        <div class="hidden md:block">
          <Card class="overflow-hidden">
            <CardHeader class="bg-[#f9fafb] border-b border-[#e5e7eb]">
              <div class="flex items-center justify-between">
                <div>
                  <CardTitle class="text-lg font-semibold text-[#111827]">{{ currentCategory.name }}</CardTitle>
                  <CardDescription class="text-[#6b7280]">{{ currentCategory.description }}</CardDescription>
                </div>
                <Button variant="primary" @click="showAddItemModal = true">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Agregar Item
                </Button>
              </div>
            </CardHeader>
            
            <CardContent class="p-0">
              <div v-if="currentCategory.items.length === 0" class="text-center py-8 text-[#6b7280]">
                <svg class="mx-auto h-12 w-12 text-[#d1d5db] mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p>No hay items en esta categoría</p>
                <Button variant="primary" size="sm" @click="showAddItemModal = true" class="mt-3">
                  Agregar Primer Item
                </Button>
              </div>
              
              <table v-else class="min-w-full">
                <thead class="bg-[#f9fafb] border-b border-[#e5e7eb]">
                  <tr>
                    <th class="px-6 py-3.5 text-left">
                      <span class="text-xs font-medium text-[#6b7280] uppercase tracking-wider">NOMBRE</span>
                    </th>
                    <th class="px-6 py-3.5 text-left">
                      <span class="text-xs font-medium text-[#6b7280] uppercase tracking-wider">MONTO</span>
                    </th>
                    <th class="px-6 py-3.5 text-right">
                      <span class="text-xs font-medium text-[#6b7280] uppercase tracking-wider">ACCIONES</span>
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-[#e5e7eb]">
                  <tr v-for="item in currentCategory.items" :key="item.id" class="hover:bg-[#f9fafb] transition-colors">
                    <td class="px-6 py-4">
                      <div v-if="editingItemId === item.id" class="flex items-center gap-2">
                        <input
                          :value="getEditValue(item.id, 'name')"
                          @input="setEditValue(item.id, 'name', $event)"
                          class="h-8 text-sm px-2 border border-[#e5e7eb] rounded"
                        />
                      </div>
                      <div v-else class="text-sm font-medium text-[#111827]">{{ item.name }}</div>
                    </td>
                    <td class="px-6 py-4">
                      <div v-if="editingItemId === item.id" class="flex items-center gap-2">
                        <input
                          :value="getEditValue(item.id, 'amount')"
                          @input="setEditValue(item.id, 'amount', $event)"
                          type="number"
                          class="h-8 text-sm px-2 border border-[#e5e7eb] rounded w-24"
                        />
                      </div>
                      <div v-else class="text-sm font-medium text-[#111827]">{{ currency }}{{ item.amount.toFixed(2) }}</div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="flex items-center justify-end gap-1">
                        <template v-if="editingItemId === item.id">
                          <button 
                            class="p-1.5 text-[#50cd89] hover:bg-[#f9fafb] rounded transition-colors" 
                            title="Guardar"
                            @click="saveEditItem(item.id)"
                            :disabled="updateItemMutation.isPending.value"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                          <button 
                            class="p-1.5 text-[#6b7280] hover:bg-[#f9fafb] rounded transition-colors" 
                            title="Cancelar"
                            @click="cancelEditItem"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </template>
                        <template v-else>
                          <button 
                            class="p-1.5 text-[#6b7280] hover:text-[#009ef7] hover:bg-[#f9fafb] rounded transition-colors" 
                            title="Editar"
                            @click="startEditItem(item.id)"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button 
                            class="p-1.5 text-[#6b7280] hover:text-[#f1416c] hover:bg-[#f9fafb] rounded transition-colors" 
                            title="Eliminar" 
                            @click="deleteItem(item.id)"
                            :disabled="deleteItemMutation.isPending.value"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </template>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </div>

      <!-- Add Item Modal -->
      <div v-if="showAddItemModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 class="text-lg font-semibold text-[#111827] mb-4">Agregar Nuevo Item</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-[#111827] mb-1">Nombre</label>
              <input
                v-model="newItemName"
                type="text"
                class="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009ef7] focus:border-transparent"
                placeholder="Ej: Comida"
                @keyup.enter="addItem"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-[#111827] mb-1">Monto</label>
              <input
                v-model="newItemAmount"
                type="number"
                class="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009ef7] focus:border-transparent"
                placeholder="0.00"
                @keyup.enter="addItem"
              />
            </div>
          </div>
          <div class="flex justify-end gap-3 mt-6">
            <Button variant="secondary" @click="showAddItemModal = false">
              Cancelar
            </Button>
            <Button 
              variant="primary" 
              @click="addItem"
              :disabled="!newItemName.trim() || !newItemAmount.trim() || addItemMutation.isPending.value"
            >
              <div v-if="addItemMutation.isPending" class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {{ addItemMutation.isPending ? 'Agregando...' : 'Agregar' }}
            </Button>
          </div>
        </div>
      </div>
    </div>
</template>
