import React, { createContext, useContext, useEffect, useState } from 'react'
import { dbService } from '../services/database'
import { storageService } from '../services/storage'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    // Check for existing session
    checkSession()

    // Listen for online/offline events
    const handleOnline = () => {
      setIsOnline(true)
      syncOfflineChanges()
    }
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const checkSession = async () => {
    setLoading(true)
    try {
      // First check local storage for offline user
      const localUser = storageService.getUserData()
      if (localUser && !localUser.id) {
        // Offline user
        setUser(localUser)
        setLoading(false)
        return
      }

      // Check for authenticated user
      if (isOnline) {
        const authResult = await dbService.authenticate()
        if (authResult.success && authResult.data.session) {
          const userResult = await dbService.getCurrentUser()
          if (userResult.success && userResult.data) {
            setUser(userResult.data)
            // Cache user data locally
            storageService.saveUserData(userResult.data)
          }
        } else if (localUser && localUser.id) {
          // Use cached user data if available
          setUser(localUser)
        }
      } else if (localUser) {
        setUser(localUser)
      }
    } catch (error) {
      console.error('Session check error:', error)
      // Try to use cached user data
      const localUser = storageService.getUserData()
      if (localUser) {
        setUser(localUser)
      }
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const result = await dbService.login(email, password)
      if (result.success) {
        const userResult = await dbService.getCurrentUser()
        if (userResult.success) {
          setUser(userResult.data)
          storageService.saveUserData(userResult.data)
        }
      }
      return result
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const signup = async (email, password, userData = {}) => {
    try {
      const result = await dbService.signup(email, password, userData)
      return result
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const resetPassword = async (email) => {
    try {
      const result = await dbService.resetPassword(email)
      return result
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const logout = async () => {
    try {
      if (isOnline && user?.id) {
        await dbService.signOut()
      }
      setUser(null)
      storageService.clear()
      return { success: true }
    } catch (error) {
      // Even if logout fails, clear local data
      setUser(null)
      storageService.clear()
      return { success: false, error: error.message }
    }
  }

  const useOffline = (userData = {}) => {
    const offlineUser = {
      name: userData.name || 'Offline User',
      rank: 'Beginner',
      isOffline: true,
      timestamp: new Date().toISOString()
    }
    setUser(offlineUser)
    storageService.saveUserData(offlineUser)
    return { success: true }
  }

  const syncOfflineChanges = async () => {
    if (!isOnline || !user?.id) return

    try {
      const result = await storageService.syncOfflineChanges(dbService)
      if (result.success) {
        console.log('Offline changes synced successfully')
      } else {
        console.error('Failed to sync offline changes:', result.error)
      }
      return result
    } catch (error) {
      console.error('Sync error:', error)
      return { success: false, error: error.message }
    }
  }

  const value = {
    user,
    loading,
    isOnline,
    login,
    signup,
    resetPassword,
    logout,
    useOffline,
    checkSession,
    syncOfflineChanges
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext