'use client'
import { useState, useEffect } from 'react'
import { api, saveToken, clearToken, UserResponse } from '@/lib/api'

export function useAuth() {
  const [user, setUser] = useState<UserResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('backendpath_token') : null
    if (token) {
      api.users.me()
        .then(setUser)
        .catch(() => clearToken())
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    const { access_token } = await api.auth.login({ email, password })
    saveToken(access_token)
    const me = await api.users.me()
    setUser(me)
    return me
  }

  const register = async (email: string, password: string, display_name?: string) => {
    await api.auth.register({ email, password, display_name })
    return login(email, password)
  }

  const logout = () => {
    clearToken()
    setUser(null)
  }

  return { user, loading, login, register, logout, isLoggedIn: !!user }
}
