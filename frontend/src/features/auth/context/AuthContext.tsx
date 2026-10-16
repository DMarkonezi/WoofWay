import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authService, CurrentUser } from '../services/authService'

interface AuthContextType {
  user: CurrentUser | null
  isLoading: boolean
  login: (token: string, user: CurrentUser) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<CurrentUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('woof_token')
      if (token) {
        try {
          const userData = await authService.me()
          setUser(userData)
        } catch {
          authService.logout()
          setUser(null)
        }
      }
      setIsLoading(false)
    }
    initAuth()
  }, [])

  const login = (token: string, userData: CurrentUser) => {
    authService.saveToken(token)
    setUser(userData)
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth mora biti unutar AuthProvider-a')
  return context
}