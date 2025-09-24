import CryptoJS from 'crypto-js'

const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'default-key-change-in-production'
const STORAGE_KEYS = {
  USER_DATA: 'honest_hero_user_data',
  OFFLINE_QUEUE: 'honest_hero_offline_queue',
  TASK_HISTORY: 'honest_hero_task_history',
  PROGRESS: 'honest_hero_progress',
  ARCS: 'honest_hero_arcs'
}

class StorageService {
  // Encryption/Decryption methods
  encrypt(data) {
    try {
      const jsonString = JSON.stringify(data)
      const encrypted = CryptoJS.AES.encrypt(jsonString, ENCRYPTION_KEY).toString()
      return encrypted
    } catch (error) {
      console.error('Encryption error:', error)
      return null
    }
  }

  decrypt(encryptedData) {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY)
      const decryptedString = bytes.toString(CryptoJS.enc.Utf8)
      return JSON.parse(decryptedString)
    } catch (error) {
      console.error('Decryption error:', error)
      return null
    }
  }

  // Storage methods
  setItem(key, data) {
    try {
      const encrypted = this.encrypt(data)
      if (encrypted) {
        localStorage.setItem(key, encrypted)
        return true
      }
      return false
    } catch (error) {
      console.error('Storage set error:', error)
      return false
    }
  }

  getItem(key) {
    try {
      const encrypted = localStorage.getItem(key)
      if (!encrypted) return null
      
      const decrypted = this.decrypt(encrypted)
      return decrypted
    } catch (error) {
      console.error('Storage get error:', error)
      return null
    }
  }

  removeItem(key) {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error('Storage remove error:', error)
      return false
    }
  }

  clear() {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key)
      })
      return true
    } catch (error) {
      console.error('Storage clear error:', error)
      return false
    }
  }

  // User data methods
  saveUserData(userData) {
    return this.setItem(STORAGE_KEYS.USER_DATA, {
      ...userData,
      timestamp: new Date().toISOString()
    })
  }

  getUserData() {
    const data = this.getItem(STORAGE_KEYS.USER_DATA)
    if (!data) return null

    // Verify data integrity by checking timestamp
    const now = new Date()
    const stored = new Date(data.timestamp)
    const hoursDiff = (now - stored) / (1000 * 60 * 60)

    // If data is older than 24 hours, consider it potentially stale
    if (hoursDiff > 24) {
      console.warn('Stored user data is older than 24 hours')
    }

    return data
  }

  // Offline queue methods
  addToOfflineQueue(action) {
    const queue = this.getItem(STORAGE_KEYS.OFFLINE_QUEUE) || []
    queue.push({
      ...action,
      timestamp: new Date().toISOString(),
      id: Date.now().toString()
    })
    return this.setItem(STORAGE_KEYS.OFFLINE_QUEUE, queue)
  }

  getOfflineQueue() {
    return this.getItem(STORAGE_KEYS.OFFLINE_QUEUE) || []
  }

  removeFromOfflineQueue(actionId) {
    const queue = this.getItem(STORAGE_KEYS.OFFLINE_QUEUE) || []
    const updatedQueue = queue.filter(action => action.id !== actionId)
    return this.setItem(STORAGE_KEYS.OFFLINE_QUEUE, updatedQueue)
  }

  clearOfflineQueue() {
    return this.removeItem(STORAGE_KEYS.OFFLINE_QUEUE)
  }

  // Cache methods for offline data
  cacheTaskHistory(taskHistory) {
    return this.setItem(STORAGE_KEYS.TASK_HISTORY, taskHistory)
  }

  getCachedTaskHistory() {
    return this.getItem(STORAGE_KEYS.TASK_HISTORY)
  }

  cacheProgress(progress) {
    return this.setItem(STORAGE_KEYS.PROGRESS, progress)
  }

  getCachedProgress() {
    return this.getItem(STORAGE_KEYS.PROGRESS)
  }

  cacheArcs(arcs) {
    return this.setItem(STORAGE_KEYS.ARCS, arcs)
  }

  getCachedArcs() {
    return this.getItem(STORAGE_KEYS.ARCS)
  }

  // Check if user is logged in based on stored data
  isUserLoggedIn() {
    const userData = this.getUserData()
    return userData && userData.id && userData.isApproved
  }

  // Network status methods
  isOnline() {
    return navigator.onLine
  }

  // Sync methods
  async syncOfflineChanges(dbService) {
    if (!this.isOnline()) {
      console.log('No internet connection, cannot sync')
      return { success: false, error: 'No internet connection' }
    }

    const queue = this.getOfflineQueue()
    if (queue.length === 0) {
      return { success: true, message: 'No changes to sync' }
    }

    const results = []
    
    for (const action of queue) {
      try {
        let result
        
        switch (action.type) {
          case 'COMPLETE_TASK':
            result = await dbService.markTaskComplete(action.data.userTaskId)
            break
          // Add more action types as needed
          default:
            console.warn('Unknown action type:', action.type)
            continue
        }

        if (result.success) {
          await this.removeFromOfflineQueue(action.id)
          results.push({ success: true, action })
        } else {
          results.push({ success: false, action, error: result.error })
        }
      } catch (error) {
        console.error('Sync error for action:', action, error)
        results.push({ success: false, action, error: error.message })
      }
    }

    const successCount = results.filter(r => r.success).length
    const failCount = results.filter(r => !r.success).length

    return {
      success: failCount === 0,
      message: `Synced ${successCount} actions, ${failCount} failed`,
      results
    }
  }
}

export const storageService = new StorageService()
export { STORAGE_KEYS }
