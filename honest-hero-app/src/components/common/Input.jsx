import React, { forwardRef } from 'react'

const Input = forwardRef(({ 
  type = 'text', 
  label, 
  error, 
  className = '', 
  required = false,
  ...props 
}, ref) => {
  const inputClasses = [
    'input',
    error && 'input--error',
    className
  ].filter(Boolean).join(' ')

  return (
    <div className="input-group">
      {label && (
        <label className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={inputClasses}
        {...props}
      />
      {error && <span className="input-error">{error}</span>}
    </div>
  )
})

Input.displayName = 'Input'

export default Input