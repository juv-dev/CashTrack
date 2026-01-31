// Budget Module Types
export interface BudgetTable {
  id: string
  name: string
  description: string
  items: BudgetItem[]
  createdAt: string
  updatedAt: string
}

export interface BudgetItem {
  id: string
  name: string
  amount: number
  category?: string
  date?: string
}

export interface BudgetCategory {
  id: string
  category: string
  monthlyBudget: number
  currentSpent: number
  percentage: number
  status: 'success' | 'warning' | 'danger'
  trend: 'up' | 'down' | 'stable'
  recommendations: string[]
  isFixed: boolean
}

export interface PlanningData {
  targetSavings: number
  emergencyFund: number
  investmentAmount: number
  personalExpenses: number
  categories: any[]
}
