import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ExclamationTriangleIcon, GlobeAltIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../../context/AuthContext'
import { storageService } from '../../services/storage'

const OfflineStatus = () => {
  const { t } = useTranslation()
  const { user, clearOfflineMode } = useAuth()
  const navigate = useNavigate()
  const queuedChanges = storageService.getOfflineQueue()
  
  // Check if user is in offline mode (not just offline network)
  const isOfflineMode = user && user.isOffline && !user.id

  const handleSwitchToOnline = () => {
    clearOfflineMode()
    navigate('/login')
  }

  return (
    <motion.div 
      className="bg-yellow-50 border-l-4 border-yellow-400 p-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex">
          <div className="flex-shrink-0">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700 font-medium">
              {isOfflineMode ? t('offline.usingOfflineMode') : t('offline.title')}
            </p>
            <p className="text-sm text-yellow-600 mt-1">
              {isOfflineMode 
                ? t('offline.signInToSyncMessage')
                : t('offline.message')
              }
            </p>
            {queuedChanges.length > 0 && (
              <motion.p 
                className="text-sm text-yellow-600 mt-2 font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {t('offline.queuedChanges', { count: queuedChanges.length })}
              </motion.p>
            )}
          </div>
        </div>
        
        {isOfflineMode && (
          <motion.button
            onClick={handleSwitchToOnline}
            className="ml-4 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <GlobeAltIcon className="mr-1 h-3 w-3" />
            {t('offline.signIn')}
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}

export default OfflineStatus