import { motion } from 'framer-motion'
import './LoadingScreen.css'

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <motion.h1
        initial={{ clipPath: 'inset(0 100% 0 0)' }}
        animate={{ clipPath: 'inset(0 0 0 0)' }}
        transition={{ duration: 2, ease: 'easeInOut' }}
        className="loading-text"
      >
        Welcome to The Honest Game
      </motion.h1>
    </div>
  )
}

export default LoadingScreen
