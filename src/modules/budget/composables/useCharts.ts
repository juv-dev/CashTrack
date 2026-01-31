import { computed } from 'vue'
import { useBudgets } from './useBudgets'
import { useDefaultData } from '~/shared/composables'

export const useCharts = () => {
  const { tables } = useBudgets()
  const { calculateTableTotal, calculateGrandTotal } = useDefaultData()

  // Chart data for categories distribution
  const categoryDistributionData = computed(() => {
    if (!tables || !('value' in tables) || !tables.value || !Array.isArray(tables.value) || tables.value.length === 0) {
      return {
        labels: [],
        datasets: [{
          label: 'Gastos por Categoría',
          data: [],
          backgroundColor: [],
          borderColor: [],
          borderWidth: 1
        }]
      }
    }

    return {
      labels: tables.value.map((table: any) => table.name),
      datasets: [{
        label: 'Gastos por Categoría',
        data: tables.value.map((table: any) => calculateTableTotal(table)),
        backgroundColor: tables.value.map((_: any, index: number) => getChartColor(index, 0.8)),
        borderColor: tables.value.map((_: any, index: number) => getChartColor(index)),
        borderWidth: 1
      }]
    }
  })

  // Chart data for monthly comparison (mock data for demonstration)
  const monthlyComparisonData = computed(() => {
    if (!tables || !('value' in tables) || !tables.value || !Array.isArray(tables.value) || tables.value.length === 0) {
      return {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
        datasets: []
      }
    }

    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun']
    const currentTotals = tables.value.map((table: any) => calculateTableTotal(table))
    
    // Generate mock historical data (in real app, this would come from API)
    const historicalData = currentTotals.map((total: any) => {
      const base = total * 0.8
      return months.map(() => base + Math.random() * (total - base))
    })

    return {
      labels: months,
      datasets: tables.value.map((table: any, index: number) => ({
        label: table.name,
        data: historicalData[index],
        backgroundColor: getChartColor(index),
        borderColor: getChartColor(index),
        borderWidth: 2,
        tension: 0.4
      }))
    }
  })

  // Chart data for expense breakdown by category
  const expenseBreakdownData = computed(() => {
    if (!tables || !('value' in tables) || !tables.value || !Array.isArray(tables.value) || tables.value.length === 0) {
      return {
        labels: [],
        datasets: [{
          label: 'Gastos por Categoría',
          data: [],
          backgroundColor: [],
          borderColor: [],
          borderWidth: 1
        }]
      }
    }

    return {
      labels: tables.value.map((table: any) => table.name),
      datasets: [{
        label: 'Gastos por Categoría',
        data: tables.value.map((table: any) => calculateTableTotal(table)),
        backgroundColor: tables.value.map((_: any, index: number) => getChartColor(index, 0.8)),
        borderColor: tables.value.map((_: any, index: number) => getChartColor(index)),
        borderWidth: 1
      }]
    }
  })

  // Statistics
  const statistics = computed(() => {
    if (!tables || !('value' in tables) || !tables.value || !Array.isArray(tables.value) || tables.value.length === 0) {
      return {
        totalCategories: 0,
        totalExpenses: 0,
        averagePerCategory: 0,
        highestCategory: { name: 'N/A', amount: 0 },
        lowestCategory: { name: 'N/A', amount: 0 }
      }
    }

    const totals = tables.value.map((table: any) => calculateTableTotal(table))
    const total = calculateGrandTotal(tables.value)
    
    return {
      totalCategories: tables.value.length,
      totalExpenses: total,
      averagePerCategory: tables.value.length > 0 ? total / tables.value.length : 0,
      highestCategory: tables.value.length > 0 ? {
        name: tables.value.reduce((max: any, table: any) => 
          calculateTableTotal(table) > calculateTableTotal(max) ? table : max
        ).name,
        amount: Math.max(...totals)
      } : { name: 'N/A', amount: 0 },
      lowestCategory: tables.value.length > 0 ? {
        name: tables.value.reduce((min: any, table: any) => 
          calculateTableTotal(table) < calculateTableTotal(min) ? table : min
        ).name,
        amount: Math.min(...totals)
      } : { name: 'N/A', amount: 0 }
    }
  })

  // Helper function to get consistent colors
  const getChartColor = (index: number, alpha: number = 1) => {
    const colors = [
      `rgba(59, 130, 246, ${alpha})`, // Blue
      `rgba(16, 185, 129, ${alpha})`, // Green
      `rgba(251, 146, 60, ${alpha})`, // Orange
      `rgba(244, 63, 94, ${alpha})`,  // Red
      `rgba(147, 51, 234, ${alpha})`, // Purple
      `rgba(245, 158, 11, ${alpha})`, // Amber
      `rgba(6, 182, 212, ${alpha})`,  // Cyan
      `rgba(236, 72, 153, ${alpha})`  // Pink
    ]
    return colors[index % colors.length]
  }

  return {
    categoryDistributionData,
    monthlyComparisonData,
    expenseBreakdownData,
    statistics
  }
}
