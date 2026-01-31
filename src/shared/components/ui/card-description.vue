<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  name: 'CardDescription'
})

interface CardDescriptionProps {
  class?: string
}

const props = defineProps<CardDescriptionProps>()

const cardDescriptionClass = computed(() => {
  const baseClasses = 'text-sm text-gray-600'
  return `${baseClasses} ${props.class || ''}`
})
</script>

<template>
  <p :class="cardDescriptionClass">
    <slot />
  </p>
</template>
