<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  name: 'CardHeader'
})

interface CardHeaderProps {
  class?: string
}

const props = defineProps<CardHeaderProps>()

const cardHeaderClass = computed(() => {
  const baseClasses = 'flex flex-col space-y-1.5 p-6'
  return `${baseClasses} ${props.class || ''}`
})
</script>

<template>
  <div :class="cardHeaderClass">
    <slot />
  </div>
</template>
