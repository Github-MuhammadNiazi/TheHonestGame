import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'

const ResetPasswordPage = () => {
  const { t } = useTranslation()
  const { resetPassword } = useAuth()
  const navigate = useNavigate()
  
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email) {
      setError('Email is required')
      return
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError(t('auth.errors.invalidEmail'))
      return
    }

    setLoading(true)
    setError('')

    try {
      const result = await resetPassword(email)
      
      if (result.success) {
        setSuccess(true)
      } else {
        setError(result.error)
      }
    } catch (error) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-success">
            <h2 className="auth-success-title">Reset Email Sent!</h2>
            <p className="auth-success-message">
              {t('auth.success.resetEmailSent')}
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
          <h2 className="auth-form-title">{t('auth.resetPassword')}</h2>
          <p className="auth-form-description">
            Enter your email address and we'll send you a link to reset your password.
          </p>
          
          {error && (
            <div className="auth-error">{error}</div>
          )}

          <Input
            type="email"
            name="email"
            label={t('auth.email')}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setError('')
            }}
            error={error && error.includes('email') ? error : ''}
            required
          />

          <Button
            type="submit"
            loading={loading}
            className="auth-submit-button"
          >
            {t('auth.resetPasswordButton')}
          </Button>

          <div className="auth-footer">
            <Link to="/login" className="auth-link">
              {t('auth.backToLogin')}
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ResetPasswordPage