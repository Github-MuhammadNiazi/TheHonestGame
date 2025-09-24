import React from 'react'
import Button from './Button'

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  actions,
  size = 'medium' 
}) => {
  if (!isOpen) return null

  const sizeClasses = {
    small: 'modal--small',
    medium: 'modal--medium',
    large: 'modal--large'
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className={`modal ${sizeClasses[size]}`}>
        <div className="modal__header">
          {title && <h2 className="modal__title">{title}</h2>}
          <button className="modal__close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal__body">
          {children}
        </div>
        {actions && (
          <div className="modal__footer">
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}

export default Modal