import { useState, useEffect } from 'react'
import LoadingScreen from './components/LoadingScreen'
import WelcomeScreen from './components/WelcomeScreen'
import './App.css'

function App() {
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    // Implement data fetching or initialization logic here
    const timer = setTimeout(() => setLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  if (loading) return <LoadingScreen />
  return <WelcomeScreen />
}

export default App
