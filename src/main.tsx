import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './store'
import { ThemeProvider, CssBaseline } from '@mui/material'
import theme from './theme'
import './i18n'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <I18nextProvider i18n={i18n}>
          <div style={{ width: '100vw', height: '100vh' }}>
            <App />
          </div>
        </I18nextProvider>
      </ThemeProvider>
    </Provider>
  </StrictMode>,
)
