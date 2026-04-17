import { createContext, useContext, useState } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')) } catch { return null }
  })

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password })
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('user', JSON.stringify(res.data.user))
    setUser(res.data.user)
    return res.data.user
  }

  const register = async (name, email, password, phone) => {
    const res = await authAPI.register({ name, email, password, phone })
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('user', JSON.stringify(res.data.user))
    setUser(res.data.user)
    return res.data.user
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  const updateProfile = async (data) => {
    const res = await authAPI.updateProfile(data)
    const updated = res.data.user
    localStorage.setItem('user', JSON.stringify(updated))
    setUser(updated)
    return updated
  }

  // Called after OAuth redirect
  const setUserFromOAuth = (userData) => {
    setUser(userData)
  }

  const loginWithGoogle = () => {
    window.location.href = 'https://insfandcpciiqlujphxz.supabase.co/functions/v1/api/auth/google'
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, setUserFromOAuth, loginWithGoogle }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
