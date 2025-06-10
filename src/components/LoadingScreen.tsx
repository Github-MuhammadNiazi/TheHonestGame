import { motion } from 'framer-motion'

const LoadingScreen = () => {
  return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#000' }}>
      <motion.h1
        initial={{ clipPath: 'inset(0 100% 0 0)' }}
        animate={{ clipPath: 'inset(0 0 0 0)' }}
        transition={{ duration: 2, ease: 'easeInOut' }}
        style={{ color: '#fff', fontSize: '3rem', fontWeight: 700, letterSpacing: 2 }}
      >
        Loading...
      </motion.h1>
    </div>
  )
}

export default LoadingScreen
