import type { BudgetTable, BudgetItem } from '~/shared/types'
import { useDefaultData } from '../composables/useDefaultData'

// LocalStorage API Service - Frontend Only
export class BudgetsAPI {
  // Storage keys
  private static getStorageKey(userId: string) {
    return `budgets-tables-${userId}`
  }

  // Get all tables for user
  static async getTables(userId: string): Promise<BudgetTable[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const storageKey = this.getStorageKey(userId)
        const stored = localStorage.getItem(storageKey)
        
        if (stored) {
          try {
            const tables = JSON.parse(stored)
            resolve(tables)
          } catch (error) {
            console.error('Error parsing tables:', error)
            const { getDefaultTables } = useDefaultData()
            resolve(getDefaultTables())
          }
        } else {
          const { getDefaultTables } = useDefaultData()
          resolve(getDefaultTables())
        }
      }, 100) // Simulate network delay for realistic UX
    })
  }

  // Save tables for user
  static async saveTables(userId: string, tables: BudgetTable[]): Promise<BudgetTable[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const storageKey = this.getStorageKey(userId)
        localStorage.setItem(storageKey, JSON.stringify(tables))
        resolve(tables)
      }, 100)
    })
  }

  // Add item to table
  static async addItem(userId: string, tableId: string, item: Omit<BudgetItem, 'id'>): Promise<BudgetTable[]> {
    const tables = await this.getTables(userId)
    const table = tables.find(t => t.id === tableId)
    
    if (table) {
      const newItem: BudgetItem = {
        ...item,
        id: Date.now().toString()
      }
      table.items.push(newItem)
      return this.saveTables(userId, tables)
    }
    
    return tables
  }

  // Update item in table
  static async updateItem(userId: string, tableId: string, itemId: string, updates: Partial<BudgetItem>): Promise<BudgetTable[]> {
    const tables = await this.getTables(userId)
    const table = tables.find(t => t.id === tableId)
    
    if (table) {
      const itemIndex = table.items.findIndex(item => item.id === itemId)
      if (itemIndex !== -1) {
        table.items[itemIndex] = { ...table.items[itemIndex], ...updates } as BudgetItem
        return this.saveTables(userId, tables)
      }
    }
    
    return tables
  }

  // Delete item from table
  static async deleteItem(userId: string, tableId: string, itemId: string): Promise<BudgetTable[]> {
    const tables = await this.getTables(userId)
    const table = tables.find(t => t.id === tableId)
    
    if (table) {
      table.items = table.items.filter(item => item.id !== itemId)
      return this.saveTables(userId, tables)
    }
    
    return tables
  }

  // Add new table
  static async addTable(userId: string, table: Omit<BudgetTable, 'id'>): Promise<BudgetTable[]> {
    const tables = await this.getTables(userId)
    const newTable: BudgetTable = {
      ...table,
      id: Date.now().toString()
    }
    tables.push(newTable)
    return this.saveTables(userId, tables)
  }

  // Update table
  static async updateTable(userId: string, tableId: string, updates: Partial<BudgetTable>): Promise<BudgetTable[]> {
    const tables = await this.getTables(userId)
    const tableIndex = tables.findIndex(t => t.id === tableId)
    
    if (tableIndex !== -1) {
      tables[tableIndex] = { ...tables[tableIndex], ...updates } as BudgetTable
      return this.saveTables(userId, tables)
    }
    
    return tables
  }

  // Delete table
  static async deleteTable(userId: string, tableId: string): Promise<BudgetTable[]> {
    const tables = await this.getTables(userId)
    const filteredTables = tables.filter(t => t.id !== tableId)
    return this.saveTables(userId, filteredTables)
  }
}
