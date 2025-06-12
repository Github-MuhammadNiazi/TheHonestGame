import { Paper, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '../LanguageSwitcher'
import './WelcomeScreen.css'

const WelcomeScreen = () => {
  const { t } = useTranslation()
  return (
    <Paper elevation={3} className="welcome-paper">
      <motion.div
        initial="initial"
        animate="animate"
        variants={{
          initial: { opacity: 0, y: 40 },
          animate: { opacity: 1, y: 0 },
        }}
        className="welcome-motion"
      >
        <Typography variant="h4" gutterBottom className="welcome-title">{t('welcomeToTheHonestGame')}</Typography>
        <LanguageSwitcher />
      </motion.div>
    </Paper>
  )
}

export default WelcomeScreen
