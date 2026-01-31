import { defineStore } from 'pinia'
import type { AuthState, User } from '~/shared/types'

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    isAuthenticated: false
  }),

  getters: {
    currentUser: (state): User | null => state.user,
    isLoggedIn: (state): boolean => state.isAuthenticated
  },

  actions: {
    async login(username: string, password: string): Promise<boolean> {
      // Mock credentials
      if (username === 'admin' && password === 'admin123') {
        const user: User = {
          id: '1',
          name: 'admin',
          email: 'admin@cashtrack.com',
          role: 'admin',
          createdAt: new Date().toISOString()
        }
        
        this.user = user
        this.isAuthenticated = true
        
        // Store in sessionStorage for persistence
        sessionStorage.setItem('auth_user', JSON.stringify(user))
        sessionStorage.setItem('auth_authenticated', 'true')
        
        return true
      }
      
      if (username === 'jugaz' && password === 'jugaz') {
        const user: User = {
          id: '2',
          name: 'jugaz',
          email: 'jugaz@cashtrack.com',
          role: 'user',
          createdAt: new Date().toISOString()
        }
        
        this.user = user
        this.isAuthenticated = true
        
        // Store in sessionStorage for persistence
        sessionStorage.setItem('auth_user', JSON.stringify(user))
        sessionStorage.setItem('auth_authenticated', 'true')
        
        return true
      }
      
      if (username === 'fiomagr' && password === 'fiomagr') {
        const user: User = {
          id: '3',
          name: 'fiomagr',
          email: 'fiomagr@cashtrack.com',
          role: 'user',
          createdAt: new Date().toISOString()
        }
        
        this.user = user
        this.isAuthenticated = true
        
        // Store in sessionStorage for persistence
        sessionStorage.setItem('auth_user', JSON.stringify(user))
        sessionStorage.setItem('auth_authenticated', 'true')
        
        return true
      }
      
      return false
    },

    logout(): void {
      this.user = null
      this.isAuthenticated = false
      
      // Clear sessionStorage
      sessionStorage.removeItem('auth_user')
      sessionStorage.removeItem('auth_authenticated')
    },

    checkAuth(): void {
      const user = sessionStorage.getItem('auth_user')
      const isAuthenticated = sessionStorage.getItem('auth_authenticated')
      
      if (user && isAuthenticated === 'true') {
        this.user = JSON.parse(user)
        this.isAuthenticated = true
      }
    }
  }
})
