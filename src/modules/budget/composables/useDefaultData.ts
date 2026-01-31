import type { BudgetTable, BudgetItem } from '@/shared/types'

export const useDefaultData = () => {
  const getDefaultTables = (): BudgetTable[] => {
    return [
      {
        id: 'persona1',
        name: 'G. Persona 1',
        description: 'Gastos personales',
        items: [
          { id: '1', name: 'Gastos personales(celular,etc)', amount: 39.95 },
          { id: '2', name: 'Transporte', amount: 150.00 }
        ]
      },
      {
        id: 'persona2',
        name: 'G. Persona 2',
        description: 'Gastos personales',
        items: [
          { id: '3', name: 'Gastos personales(celular,etc)', amount: 39.95 },
          { id: '4', name: 'Transporte', amount: 150.00 }
        ]
      },
      {
        id: 'persona3',
        name: 'G. Persona 3',
        description: 'Gastos personales',
        items: [
          { id: '3', name: 'Gastos personales(celular,etc)', amount: 27.90 },
          { id: '4', name: 'Internet', amount: 55.00 }
        ]
      },
      {
        id: 'comida',
        name: 'Alimentos',
        description: 'Gastos de alimentos',
        items: [
          { id: '3', name: 'Comida', amount: 500.00 },
          { id: '4', name: 'Contribuciones', amount: 100.00 }
        ]
      },
      {
        id: 'plataforma',
        name: 'Plataforma',
        description: 'Suscripciones digitales',
        items: [
          { id: '1', name: 'Disney+', amount: 68.90 },
          { id: '2', name: 'ICloud', amount: 48.02 },
          { id: '3', name: 'Netflix', amount: 28.90 }
        ]
      },
      {
        id: 'servicios',
        name: 'Servicios',
        description: 'Servicios mensuales y utilidades',
        items: [
          { id: '1', name: 'Gas - 5197742', amount: 30.00 },
          { id: '2', name: 'Luz', amount: 100.00 },
          { id: '3', name: 'Internet', amount: 99.90 }
        ]
      },
      {
        id: 'lucah',
        name: 'Gastos Lucah',
        description: 'Gastos personales de Lucah',
        items: [
          { id: '1', name: 'Baño', amount: 50.00 },
          { id: '2', name: 'Comida', amount: 86.00 },
          { id: '3', name: 'Pastilla', amount: 90.00 }
        ]
      },
      {
        id: 'deudas',
        name: 'Deudas',
        description: 'Deudas',
        items: [
          { id: '1', name: 'BCP 1', amount: 584.00 },
          { id: '2', name: 'BCP 2', amount: 262.11 },
          { id: '3', name: 'Techo', amount: 788.5 }
        ]
      }
    ]
  }

  const getDefaultSalaries = () => {
    return [
      { id: '1', name: 'Sueldo 1', amount: 5200 },
      { id: '2', name: 'Sueldo 2', amount: 600 }
    ]
  }

  const calculateTableTotal = (table: BudgetTable): number => {
    return table.items.reduce((sum: number, item: BudgetItem) => sum + item.amount, 0)
  }

  const calculateGrandTotal = (tables: BudgetTable[]): number => {
    return tables.reduce((sum: number, table: BudgetTable) => {
      return sum + calculateTableTotal(table)
    }, 0)
  }

  const calculateSummary = (tables: BudgetTable[]) => {
    const totalBudgets = calculateGrandTotal(tables)
    
    return {
      totalBudgets,
      totalDebts: 0, // Simplificado para frontend-only
      totalPaid: 0,
      totalPending: totalBudgets,
      budgetsCount: tables.length,
      debtsCount: 0
    }
  }

  return {
    getDefaultTables,
    getDefaultSalaries,
    calculateTableTotal,
    calculateGrandTotal,
    calculateSummary
  }
}
