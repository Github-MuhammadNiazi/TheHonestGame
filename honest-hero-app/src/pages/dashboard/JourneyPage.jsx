import React from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

const JourneyPage = () => {
  const { t } = useTranslation()

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-gray-900">
        {t('journey.title')}
      </h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Journey page coming soon...</p>
      </div>
    </motion.div>
  )
}

export default JourneyPage