import React, { createContext, useContext, useEffect, useState } from 'react'
import { adminActions } from '@/features/admin/shared/adminStore'

export interface AuthUser {
  id: number
  name: string
  email: string
  role: string
  permissions: string[]
}

interface AuthContextValue {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (userData: AuthUser, token?: string) => void
  logout: () => void
  hasPermission: (permission: string) => boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem('lawshastra_admin_user')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem('lawshastra_admin_token')
    } catch {
      return null
    }
  })

  const [isLoading] = useState(false)

  useEffect(() => {
    if (user || token) {
      void adminActions.hydrate()
    }
  }, [user, token])

  const login = (userData: AuthUser, authToken?: string) => {
    setUser(userData)
    if (authToken) {
      setToken(authToken)
      localStorage.setItem('lawshastra_admin_token', authToken)
    }
    localStorage.setItem('lawshastra_admin_user', JSON.stringify(userData))
    void adminActions.hydrate()
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('lawshastra_admin_user')
    localStorage.removeItem('lawshastra_admin_token')
  }

  const hasPermission = (requiredPermission: string): boolean => {
    if (!user || !user.permissions) return false
    if (user.permissions.includes('*')) return true
    return user.permissions.includes(requiredPermission)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
