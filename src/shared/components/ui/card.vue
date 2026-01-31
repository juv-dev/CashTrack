<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  name: 'Card'
})

interface CardProps {
  class?: string
  variant?: 'default' | 'elevated' | 'bordered'
}

const props = withDefaults(defineProps<CardProps>(), {
  variant: 'default'
})

const cardClass = computed(() => {
  const baseClasses = 'rounded-xl transition-all duration-200'
  
  const variantClasses = {
    default: 'bg-white border border-gray-200 shadow-sm',
    elevated: 'bg-white shadow-lg border-0',
    bordered: 'bg-white border-2 border-gray-200 shadow-none'
  }
  
  return `${baseClasses} ${variantClasses[props.variant]} ${props.class || ''}`
})
</script>

<template>
  <div :class="cardClass">
    <slot />
  </div>
</template>
