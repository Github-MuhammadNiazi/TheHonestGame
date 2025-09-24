import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../context/AuthContext'
import { motion } from 'framer-motion'

const DashboardPage = () => {
  const { t } = useTranslation()
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900">
          {t('dashboard.welcomeBack')}, {user?.name || 'User'}!
        </h1>
        <p className="text-gray-600 mt-2">
          {t('app.tagline')}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          className="bg-white rounded-lg shadow p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {t('dashboard.currentTask')}
          </h2>
          <p className="text-gray-600">
            {t('dashboard.noCurrentTask')}
          </p>
        </motion.div>

        <motion.div
          className="bg-white rounded-lg shadow p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {t('dashboard.leaderboard')}
          </h2>
          <p className="text-gray-600">
            {user?.isOffline ? t('dashboard.signInForLeaderboard') : 'Coming soon...'}
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default DashboardPage