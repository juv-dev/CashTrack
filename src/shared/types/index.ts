// Shared types for CashTrack modules

export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
  createdAt: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

export interface BudgetTable {
  id: string
  name: string
  description: string
  items: BudgetItem[]
  createdAt: string
  updatedAt: string
  userId: string
}

export interface BudgetItem {
  id: string
  name: string
  amount: number
  category?: string
  date?: string
}

export interface PlanningData {
  targetSavings: number
  emergencyFund: number
  investmentAmount: number
  personalExpenses: number
  creditCardDebt: number
  totalBudget: number
  userId: string
}

export interface CreditCardDebt {
  id: string
  amount: number
  totalInstallments: number
  paidInstallments: number
  dueDate: string
  status: 'pending' | 'partial' | 'paid'
  description: string
  userId: string
  createdAt: string
  updatedAt: string
}

export interface NavigationItem {
  name: string
  label: string
  icon?: string
  component?: any
  path: string
  children?: NavigationItem[]
}

export type RouteName = 'login' | 'dashboard' | 'budgets' | 'ingresos' | 'egresos' | 'panel-control' | 'deudas' | 'deudas-historial' | 'budget-category' | 'planificacion'
