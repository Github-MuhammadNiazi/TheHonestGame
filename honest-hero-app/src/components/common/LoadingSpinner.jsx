import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const LoadingSpinner = ({ size = 'medium', message = null }) => {
  const { t } = useTranslation()
  
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  }

  const spinTransition = {
    repeat: Infinity,
    duration: 1,
    ease: "linear"
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <motion.div
        className={`${sizeClasses[size]} border-4 border-gray-200 border-t-primary-500 rounded-full`}
        animate={{ rotate: 360 }}
        transition={spinTransition}
      />
      <motion.p
        className="mt-4 text-sm text-gray-600 font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {message || t('common.loading')}
      </motion.p>
    </div>
  )
}

export default LoadingSpinner