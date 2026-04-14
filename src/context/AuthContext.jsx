import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api' // adjust path if needed

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // 🔥 Check user on refresh
  useEffect(() => {
    const verifyUser = async () => {
      const saved = localStorage.getItem('revyo_user')

      if (saved) {
        try {
          const parsed = JSON.parse(saved)

          if (parsed?.token) {
            const data = await authAPI.getMe()

            if (data?.user) {
              setUser({ ...data.user, token: parsed.token })
            } else {
              throw new Error("Invalid user")
            }
          }
        } catch (err) {
          console.error("Auth error:", err)
          localStorage.removeItem('revyo_user')
          setUser(null)
        }
      }

      setLoading(false)
    }

    verifyUser()
  }, [])

  // 🔥 REAL LOGIN (CONNECTS BACKEND)
  const login = async (email, password) => {
    const data = await authAPI.login({ email, password })

    const userData = {
      ...data.user,
      token: data.token,
    }

    localStorage.setItem('revyo_user', JSON.stringify(userData))
    setUser(userData)

    return data
  }

  const register = async (formData) => {
    const data = await authAPI.register(formData)

    const userData = {
      ...data.user,
      token: data.token,
    }

    localStorage.setItem('revyo_user', JSON.stringify(userData))
    setUser(userData)

    return data
  }

  const logout = () => {
    localStorage.removeItem('revyo_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)