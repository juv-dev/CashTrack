<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label, Alert, AlertDescription } from '~/shared/components'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const isLoading = ref(false)
const error = ref('')

const handleLogin = async () => {
  if (!username.value || !password.value) {
    error.value = 'Por favor, complete todos los campos'
    return
  }

  isLoading.value = true
  error.value = ''

  try {
    const success = await authStore.login(username.value, password.value)
    if (success) {
      router.push('/dashboard')
    } else {
      error.value = 'Credenciales incorrectas. Intente con admin/admin123'
    }
  } catch (err) {
    error.value = 'Error al iniciar sesión'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#f9fafb] flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Logo Section -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-[#009ef7] rounded-2xl flex items-center justify-center shadow-lg mb-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-[#111827] mb-2">CashTrack</h1>
        <p class="text-[#6b7280]">Control de finanzas personales</p>
      </div>
      
      <!-- Login Card -->
      <Card class="bg-white shadow-xl border-0">
        <CardHeader class="px-8 pt-8 pb-0">
          <CardTitle class="text-2xl font-semibold text-center text-[#111827] mb-2">Bienvenido de nuevo</CardTitle>
          <CardDescription class="text-center text-[#6b7280]">
            Ingresa tus credenciales para acceder a tu dashboard
          </CardDescription>
        </CardHeader>
        <CardContent class="px-8 pb-8">
          <form @submit.prevent="handleLogin" class="space-y-6">
            <div class="space-y-2">
              <Label for="username" class="text-sm font-medium text-[#374151]">Usuario</Label>
              <Input
                id="username"
                v-model="username"
                type="text"
                placeholder="admin"
                size="lg"
                :disabled="isLoading"
                required
                class="h-12"
              />
            </div>
            
            <div class="space-y-2">
              <Label for="password" class="text-sm font-medium text-[#374151]">Contraseña</Label>
              <Input
                id="password"
                v-model="password"
                type="password"
                placeholder="••••••••••"
                size="lg"
                :disabled="isLoading"
                required
                class="h-12"
              />
            </div>

            <Alert v-if="error" class="border-[#f8d5da] bg-[#f8d5da]">
              <AlertDescription class="text-[#f1416c]">{{ error }}</AlertDescription>
            </Alert>

            <Button 
              type="submit" 
              class="w-full h-12 text-base font-medium"
              variant="primary"
              :loading="isLoading"
              :disabled="isLoading"
            >
              <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018 0 9 9 0 0118 0z"></path>
              </svg>
              {{ isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
            </Button>
          </form>
          
          <!-- Demo Credentials -->
          <div class="mt-6 p-4 bg-[#f3f4f6] rounded-xl border border-[#e5e7eb]">
            <div class="flex items-center mb-2">
              <svg class="w-5 h-5 text-[#009ef7] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p class="text-sm font-medium text-[#009ef7]">Credenciales de demostración</p>
            </div>
            <div class="text-sm text-[#6b7280] space-y-1">
              <p><span class="font-medium">Usuario:</span> admin</p>
              <p><span class="font-medium">Contraseña:</span> admin123</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Footer -->
      <div class="text-center mt-8 text-sm text-[#6b7280]">
        <p>© 2024 CashTrack. Todos los derechos reservados.</p>
      </div>
    </div>
  </div>
</template>
