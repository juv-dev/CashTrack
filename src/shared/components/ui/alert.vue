<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  name: 'Alert'
})

interface AlertProps {
  variant?: 'default' | 'destructive'
  class?: string
}

const props = withDefaults(defineProps<AlertProps>(), {
  variant: 'default',
})

const alertClass = computed(() => {
  const baseClasses = 'relative w-full rounded-lg border p-4'
  const variantClasses = {
    default: 'bg-white text-gray-950 border-gray-200',
    destructive: 'bg-red-50 text-red-900 border-red-200',
  }
  return `${baseClasses} ${variantClasses[props.variant]} ${props.class || ''}`
})
</script>

<template>
  <div :class="alertClass" role="alert">
    <slot />
  </div>
</template>
