<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  name: 'CardContent'
})

interface CardContentProps {
  class?: string
}

const props = defineProps<CardContentProps>()

const cardContentClass = computed(() => {
  const baseClasses = 'p-6 pt-0'
  return `${baseClasses} ${props.class || ''}`
})
</script>

<template>
  <div :class="cardContentClass">
    <slot />
  </div>
</template>
