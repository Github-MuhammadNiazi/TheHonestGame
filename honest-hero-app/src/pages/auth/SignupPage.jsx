import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import { motion } from 'framer-motion'

const SignupPage = () => {
  const { t } = useTranslation()
  const { signup, user, clearOfflineMode, useOffline } = useAuth()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // Check if user is currently in offline mode
  const isOfflineMode = user && user.isOffline && !user.id

  const handleSwitchToOnline = () => {
    clearOfflineMode()
    // Stay on current page to allow user to sign up
  }

  const handleOfflineUse = () => {
    useOffline()
    navigate('/dashboard')
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = t('auth.errors.nameRequired')
    }
    
    if (!formData.email) {
      newErrors.email = t('auth.errors.emailRequired')
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('auth.errors.invalidEmail')
    }
    
    if (!formData.password) {
      newErrors.password = t('auth.errors.passwordRequired')
    } else if (formData.password.length < 6) {
      newErrors.password = t('auth.errors.passwordTooShort')
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t('auth.errors.confirmPasswordRequired')
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('auth.errors.passwordMismatch')
    }
    
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    setErrors({})

    try {
      const result = await signup(formData.email, formData.password, {
        name: formData.name
      })
      
      if (result.success) {
        setSuccess(true)
      } else {
        setErrors({ general: result.error })
      }
    } catch (error) {
      setErrors({ general: t('auth.errors.unexpectedError') })
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </motion.div>
            <motion.h2 
              className="mt-6 text-center text-3xl font-extrabold text-gray-900"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {t('auth.success.accountCreatedTitle')}
            </motion.h2>
            <motion.p 
              className="mt-2 text-center text-sm text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {t('auth.success.accountCreated')}
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
            <h2 className="text-xl font-semibold text-gray-900 text-center">{t('auth.signup')}</h2>
          
            {errors.general && (
              <motion.div 
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                {errors.general}
              </motion.div>
            )}

            {isOfflineMode && (
              <motion.div 
                className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <p className="font-medium">{t('auth.currentlyOffline')}</p>
                <p className="text-sm mt-1">{t('auth.offlineModeSignupMessage')}</p>
              </motion.div>
            )}

            <Input
              type="text"
              name="name"
              label={t('profile.name')}
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              required
            />

            <Input
              type="email"
              name="email"
              label={t('auth.email')}
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
            />

            <Input
              type="password"
              name="password"
              label={t('auth.password')}
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
            />

            <Input
              type="password"
              name="confirmPassword"
              label={t('auth.confirmPassword')}
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              required
            />
          </div>

          <Button
            type="submit"
            loading={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isOfflineMode ? t('auth.createAccountAndSync') : t('auth.signUpButton')}
          </Button>

          {!isOfflineMode && (
            <>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-50 text-gray-500">{t('common.or')}</span>
                </div>
              </div>

              <motion.button
                type="button"
                onClick={handleOfflineUse}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {t('auth.offlineUse')}
              </motion.button>
            </>
          )}

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
            <p className="text-sm text-gray-600">
              {t('auth.alreadyHaveAccount')}{' '}
              <Link 
                to="/login" 
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                {t('auth.login')}
              </Link>
            </p>
          </div>
        </motion.form>
      </motion.div>
    </div>
  )
}

export default SignupPage