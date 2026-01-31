import { defineStore } from 'pinia'
import type { User } from '@/modules/shared/types'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: null as string | null,
    isAuthenticated: false
  }),

  getters: {
    currentUser: (state) => state.user,
    isLoggedIn: (state) => state.isAuthenticated
  },

  actions: {
    login(credentials: { email: string; password: string }) {
      // TODO: Implement actual login logic
      this.user = {
        id: '1',
        name: 'User',
        email: credentials.email,
        role: 'user',
        createdAt: new Date().toISOString()
      }
      this.token = 'mock-token'
      this.isAuthenticated = true
    },

    logout() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
    },

    setUser(user: User) {
      this.user = user
      this.isAuthenticated = true
    }
  }
})
