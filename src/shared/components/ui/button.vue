<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  name: 'Button'
})

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  class?: string
  type?: 'button' | 'submit' | 'reset'
  loading?: boolean
}

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  loading: false,
})

const buttonClass = computed(() => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variantClasses = {
    primary: 'bg-[#009ef7] text-white hover:bg-[#0078d4] focus:ring-[#e1f0ff] shadow-sm hover:shadow-md',
    secondary: 'bg-[#f3f4f6] text-[#374151] hover:bg-[#e5e7eb] focus:ring-[#e1f0ff] border border-[#d1d5db]',
    success: 'bg-[#50cd89] text-white hover:bg-[#42b878] focus:ring-[#e8f5f0] shadow-sm hover:shadow-md',
    danger: 'bg-[#f1416c] text-white hover:bg-[#d9294e] focus:ring-[#f8d5da] shadow-sm hover:shadow-md',
    warning: 'bg-[#ffc700] text-white hover:bg-[#e6b300] focus:ring-[#fff4e6] shadow-sm hover:shadow-md',
    info: 'bg-[#7239ea] text-white hover:bg-[#632dd4] focus:ring-[#f3e8ff] shadow-sm hover:shadow-md',
    light: 'bg-white text-[#374151] hover:bg-[#f9fafb] focus:ring-[#e1f0ff] border border-[#e5e7eb] shadow-sm',
    dark: 'bg-[#1f2937] text-white hover:bg-[#111827] focus:ring-[#374151] shadow-sm hover:shadow-md',
    ghost: 'text-[#6b7280] hover:text-[#374151] hover:bg-[#f3f4f6] focus:ring-[#e1f0ff]'
  }
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  }
  
  return `${baseClasses} ${variantClasses[props.variant]} ${sizeClasses[props.size]} ${props.class || ''}`
})
</script>

<template>
  <button 
    :type="type"
    :class="buttonClass" 
    :disabled="disabled || loading"
  >
    <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <slot />
  </button>
</template>
