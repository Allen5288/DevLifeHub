import React, { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  // Check auth status on mount
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/check`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })
      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
      }
    } catch (error) {
      console.error('Auth check error:', error)
    }
  }

  const login = async userData => {
    setUser(userData)
  }

  const logout = async () => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })
      setUser(null)
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const performLogin = async (email, password, navigate) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Login failed')
      }

      const data = await response.json()
      if (data.token) {
        localStorage.setItem('token', data.token) // 存储令牌
      }
      login(data.user)
      navigate('/tools')
    } catch (error) {
      throw error // Re-throw the error to be caught by the caller
    }
  }

  return <AuthContext.Provider value={{ user, login, logout, performLogin }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
