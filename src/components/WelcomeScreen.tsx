import { Paper, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './LanguageSwitcher'

const WelcomeScreen = () => {
  const { t } = useTranslation()
  return (
    <Paper elevation={3} sx={{ p: 4, mt: 4, maxWidth: 400, mx: 'auto' }}>
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}>
        <Typography variant="h4" gutterBottom>{t('welcomeToTheHonestGame')}</Typography>
        <LanguageSwitcher />
      </motion.div>
    </Paper>
  )
}

export default WelcomeScreen
