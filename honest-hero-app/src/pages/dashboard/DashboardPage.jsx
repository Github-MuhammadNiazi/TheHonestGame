import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { GlobeAltIcon, UserPlusIcon } from '@heroicons/react/24/outline'

const DashboardPage = () => {
  const { t } = useTranslation()
  const { user, clearOfflineMode } = useAuth()
  const navigate = useNavigate()

  // Check if user is in offline mode
  const isOfflineMode = user && user.isOffline && !user.id

  const handleSwitchToOnline = () => {
    clearOfflineMode()
    navigate('/login')
  }

  const handleSignUp = () => {
    navigate('/signup')
  }

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

      {/* Offline Mode Banner */}
      {isOfflineMode && (
        <motion.div
          className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <GlobeAltIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                {t('dashboard.offlineMode.title')}
              </h3>
              <p className="text-blue-700 mb-4">
                {t('dashboard.offlineMode.message')}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <motion.button
                  onClick={handleSwitchToOnline}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <GlobeAltIcon className="mr-2 h-4 w-4" />
                  {t('dashboard.offlineMode.signInToSync')}
                </motion.button>
                <motion.button
                  onClick={handleSignUp}
                  className="inline-flex items-center px-4 py-2 border border-blue-600 text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <UserPlusIcon className="mr-2 h-4 w-4" />
                  {t('dashboard.offlineMode.createAccount')}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

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