// Auth Module Types
export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthUser {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
  createdAt: string
}
