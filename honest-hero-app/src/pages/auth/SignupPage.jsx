import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'

const SignupPage = () => {
  const { t } = useTranslation()
  const { signup } = useAuth()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('auth.errors.invalidEmail')
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('auth.errors.passwordMismatch')
    }
    
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    setErrors({})

    try {
      const result = await signup(formData.email, formData.password, {
        name: formData.name
      })
      
      if (result.success) {
        setSuccess(true)
      } else {
        setErrors({ general: result.error })
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred' })
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-success">
            <h2 className="auth-success-title">Account Created!</h2>
            <p className="auth-success-message">
              {t('auth.success.accountCreated')}
            </p>
            <Button onClick={() => navigate('/login')}>
              {t('auth.backToLogin')}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1 className="auth-title">{t('app.name')}</h1>
          <p className="auth-tagline">{t('app.tagline')}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <h2 className="auth-form-title">{t('auth.signup')}</h2>
          
          {errors.general && (
            <div className="auth-error">{errors.general}</div>
          )}

          <Input
            type="text"
            name="name"
            label={t('profile.name')}
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
          />

          <Input
            type="email"
            name="email"
            label={t('auth.email')}
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
          />

          <Input
            type="password"
            name="password"
            label={t('auth.password')}
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
          />

          <Input
            type="password"
            name="confirmPassword"
            label={t('auth.confirmPassword')}
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            required
          />

          <Button
            type="submit"
            loading={loading}
            className="auth-submit-button"
          >
            {t('auth.signUpButton')}
          </Button>

          <div className="auth-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="auth-link">
                {t('auth.login')}
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignupPage