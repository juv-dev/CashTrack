<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  name: 'CardTitle'
})

interface CardTitleProps {
  class?: string
}

const props = defineProps<CardTitleProps>()

const cardTitleClass = computed(() => {
  const baseClasses = 'text-2xl font-semibold leading-none tracking-tight'
  return `${baseClasses} ${props.class || ''}`
})
</script>

<template>
  <h3 :class="cardTitleClass">
    <slot />
  </h3>
</template>
