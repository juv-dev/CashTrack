<script setup lang="ts">
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface Props {
  data: {
    labels: string[]
    datasets: Array<{
      label: string
      data: number[]
      backgroundColor: string[]
      borderColor: string[]
      borderWidth: number
    }>
  }
  options?: any
}

const props = withDefaults(defineProps<Props>(), {
  options: () => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || ''
            const value = context.parsed.y || 0
            return `${label}: S/ ${value.toFixed(2)}`
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: any) => `S/ ${value}`
        }
      }
    }
  })
})

// Check if data is valid
const hasData = computed(() => {
  return props.data && 
         props.data.labels && 
         props.data.labels.length > 0 && 
         props.data.datasets && 
         props.data.datasets[0] && 
         props.data.datasets[0].data && 
         props.data.datasets[0].data.some(value => value > 0)
})
</script>

<template>
  <div class="h-80">
    <div v-if="!hasData" class="flex items-center justify-center h-full text-gray-500">
      <div class="text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <p class="text-sm">No hay datos disponibles</p>
      </div>
    </div>
    <Bar v-else :data="data" :options="options" />
  </div>
</template>
