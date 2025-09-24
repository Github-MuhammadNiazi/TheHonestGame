import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import { motion } from 'framer-motion'

const ResetPasswordPage = () => {
  const { t } = useTranslation()
  const { resetPassword, user, clearOfflineMode, useOffline } = useAuth()
  const navigate = useNavigate()
  
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // Check if user is currently in offline mode
  const isOfflineMode = user && user.isOffline && !user.id

  const handleSwitchToOnline = () => {
    clearOfflineMode()
    // Stay on current page to allow user to reset password
  }

  const handleOfflineUse = () => {
    useOffline()
    navigate('/dashboard')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email) {
      setError(t('auth.errors.emailRequired'))
      return
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError(t('auth.errors.invalidEmail'))
      return
    }

    setLoading(true)
    setError('')

    try {
      const result = await resetPassword(email)
      
      if (result.success) {
        setSuccess(true)
      } else {
        setError(result.error)
      }
    } catch (error) {
      setError(t('auth.errors.unexpectedError'))
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="max-w-md w-full space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <motion.div
              className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </motion.div>
            <motion.h2 
              className="mt-6 text-center text-3xl font-extrabold text-gray-900"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {t('auth.success.resetEmailSentTitle')}
            </motion.h2>
            <motion.p 
              className="mt-2 text-center text-sm text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {t('auth.success.resetEmailSent')}
            </motion.p>
            <motion.div
              className="mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Button 
                onClick={() => navigate('/login')}
                className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                {t('auth.backToLogin')}
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="max-w-md w-full space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <motion.h2 
            className="mt-6 text-center text-3xl font-extrabold text-gray-900"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {t('app.name')}
          </motion.h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t('app.tagline')}
          </p>
        </div>

        <motion.form 
          onSubmit={handleSubmit} 
          className="mt-8 space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 text-center">{t('auth.resetPassword')}</h2>
            <p className="text-sm text-gray-600 text-center">
              {t('auth.resetPasswordDescription')}
            </p>
          
            {error && (
              <motion.div 
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                {error}
              </motion.div>
            )}

            {isOfflineMode && (
              <motion.div 
                className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <p className="font-medium">{t('auth.currentlyOffline')}</p>
                <p className="text-sm mt-1">{t('auth.offlineModeResetMessage')}</p>
              </motion.div>
            )}

            <Input
              type="email"
              name="email"
              label={t('auth.email')}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setError('')
              }}
              error={error && error.includes('email') ? error : ''}
              required
              disabled={isOfflineMode}
            />
          </div>

          <Button
            type="submit"
            loading={loading}
            disabled={isOfflineMode}
            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('auth.resetPasswordButton')}
          </Button>

          {isOfflineMode && (
            <div className="flex space-x-3">
              <motion.button
                type="button"
                onClick={handleSwitchToOnline}
                className="flex-1 flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {t('auth.switchToOnlineMode')}
              </motion.button>
              <motion.button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="flex-1 flex justify-center py-2 px-4 border border-primary-600 text-sm font-medium rounded-lg text-primary-600 bg-white hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {t('auth.continueOffline')}
              </motion.button>
            </div>
          )}

          <div className="text-center">
            <Link 
              to="/login" 
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              {t('auth.backToLogin')}
            </Link>
          </div>
        </motion.form>
      </motion.div>
    </div>
  )
}

export default ResetPasswordPage