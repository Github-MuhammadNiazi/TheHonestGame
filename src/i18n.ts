import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    translation: {
      welcomeToTheHonestGame: 'Welcome to The Honest Game!',
      reset: 'Reset',
    },
  },
  ur: {
    translation: {
      welcomeToTheHonestGame: 'دی آنیسٹ گیم میں خوش آمدید',
      reset: 'ری سیٹ کریں',
    },
  },
  hi: {
    translation: {
      welcomeToTheHonestGame: 'द ऑनेस्ट गेम में आपका स्वागत है!',
      reset: 'रीसेट करें',
    },
  },
  es: {
    translation: {
      welcomeToTheHonestGame: '¡Bienvenido a The Honest Game!',
      reset: 'Restablecer',
    },
  },
  // Add more languages here
}

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n

