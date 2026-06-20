import { createContext, useContext, useEffect, useState } from 'react'
import { authApi } from '../api/authApi'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const email = localStorage.getItem('email')
    const role = localStorage.getItem('role')
    const fullName = localStorage.getItem('fullName')
    const accessToken = localStorage.getItem('accessToken')

    if (accessToken && email && role) {
      setUser({ email, role, fullName })
    }
    setLoading(false)
  }, [])

  const persistSession = (data) => {
    localStorage.setItem('accessToken', data.accessToken)
    localStorage.setItem('refreshToken', data.refreshToken)
    localStorage.setItem('email', data.email)
    localStorage.setItem('role', data.role)
    localStorage.setItem('fullName', data.fullName)
    setUser({ email: data.email, role: data.role, fullName: data.fullName })
  }

  const login = async (payload) => {
    const { data } = await authApi.login(payload)
    persistSession(data.data)
    toast.success(`Welcome back, ${data.data.fullName.split(' ')[0]}!`)
    return data.data
  }

  const register = async (payload) => {
    const { data } = await authApi.register(payload)
    persistSession(data.data)
    toast.success('Account created successfully!')
    return data.data
  }

  const logout = () => {
    localStorage.clear()
    setUser(null)
    toast.success('Logged out successfully')
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin: user?.role === 'ADMIN' }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
