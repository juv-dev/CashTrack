<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  name: 'Label'
})

interface LabelProps {
  for?: string
  class?: string
}

const props = defineProps<LabelProps>()

const labelClass = computed(() => {
  const baseClasses = 'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
  return `${baseClasses} ${props.class || ''}`
})
</script>

<template>
  <label :for="for" :class="labelClass">
    <slot />
  </label>
</template>
