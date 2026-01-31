<script setup lang="ts">
import { computed } from 'vue'

defineOptions({
  name: 'Table'
})

interface TableProps {
  class?: string
  hover?: boolean
  striped?: boolean
}

const props = withDefaults(defineProps<TableProps>(), {
  hover: true,
  striped: false,
})

const tableClass = computed(() => {
  const baseClasses = 'w-full border-collapse border-[#e5e7eb] bg-white text-sm text-left'
  return `${baseClasses} ${props.class || ''}`
})

const tableHeaderClass = computed(() => {
  return 'bg-[#f9fafb] text-[#374151] font-medium'
})

const tableHeadCellClass = computed(() => {
  return 'px-4 py-3.5 text-[#374151] font-medium'
})
</script>

<template>
  <div :class="tableClass">
    <table>
      <thead>
        <tr :class="tableHeaderClass">
          <slot name="header" :tableHeadCellClass="tableHeadCellClass" />
        </tr>
      </thead>
      <tbody>
        <slot name="body" />
      </tbody>
    </table>
  </div>
</template>
