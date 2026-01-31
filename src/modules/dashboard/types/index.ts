// Dashboard Module Types
export interface DashboardStats {
  totalIncome: number
  totalExpenses: number
  balance: number
  savingsRate: number
}

export interface Transaction {
  id: string
  type: 'income' | 'expense'
  amount: number
  description: string
  category: string
  date: string
}

export interface MonthlyData {
  month: string
  income: number
  expenses: number
}
