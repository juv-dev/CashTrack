<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  name: 'AlertDescription'
})

interface AlertDescriptionProps {
  class?: string
}

const props = defineProps<AlertDescriptionProps>()

const alertDescriptionClass = computed(() => {
  const baseClasses = 'text-sm'
  return `${baseClasses} ${props.class || ''}`
})
</script>

<template>
  <div :class="alertDescriptionClass">
    <slot />
  </div>
</template>
