import React from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { storageService } from '../../services/storage'

const OfflineStatus = () => {
  const { t } = useTranslation()
  const queuedChanges = storageService.getOfflineQueue()

  return (
    <motion.div 
      className="bg-yellow-50 border-l-4 border-yellow-400 p-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-yellow-700 font-medium">
            {t('offline.title')}
          </p>
          <p className="text-sm text-yellow-600 mt-1">
            {t('offline.message')}
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
    </motion.div>
  )
}

export default OfflineStatus