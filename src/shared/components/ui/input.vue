<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  name: 'Input'
})

interface InputProps {
  modelValue?: string | number
  type?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  class?: string
  id?: string
  size?: 'sm' | 'md' | 'lg'
  state?: 'default' | 'error' | 'success'
}

const props = withDefaults(defineProps<InputProps>(), {
  type: 'text',
  size: 'md',
  state: 'default',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const inputClass = computed(() => {
  const baseClasses = 'block w-full rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  }
  
  const stateClasses = {
    default: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white',
    error: 'border-red-300 focus:border-red-500 focus:ring-red-500 bg-white',
    success: 'border-green-300 focus:border-green-500 focus:ring-green-500 bg-white'
  }
  
  return `${baseClasses} ${sizeClasses[props.size]} ${stateClasses[props.state]} ${props.class || ''}`
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <input
    :id="id"
    :class="inputClass"
    :type="type"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :required="required"
    @input="handleInput"
  />
</template>
