import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#d32f2f',
    },
    secondary: {
      main: '#000000',
    },
    background: {
      default: '#121212',
      paper: '#1a1a1a',
    },
    text: {
      primary: '#fff',
      secondary: '#d32f2f',
    },
  },
  typography: {
    fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif',
    h4: {
      color: '#d32f2f',
      fontWeight: 700,
    },
    h6: {
      color: '#fff',
    },
  },
})

export default theme
