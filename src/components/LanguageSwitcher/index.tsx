import { useTranslation } from 'react-i18next'
import { MenuItem, Select, FormControl, InputLabel } from '@mui/material'
import './LanguageSwitcher.css'

const LanguageSwitcher = () => {
  const { i18n } = useTranslation()
  return (
    <FormControl size="small" className="language-switcher">
      <InputLabel id="lang-select-label">Language</InputLabel>
      <Select
        labelId="lang-select-label"
        value={i18n.language}
        label="Language"
        onChange={e => i18n.changeLanguage(e.target.value)}
      >
        <MenuItem value="en">English</MenuItem>
        <MenuItem value="ur">اردو</MenuItem>
        <MenuItem value="hi">हिन्दी</MenuItem>
        <MenuItem value="es">Español</MenuItem>
      </Select>
    </FormControl>
  )
}

export default LanguageSwitcher
