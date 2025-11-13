import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Button
 * Accessible button with variants.
 */
export function Button({ children, variant = 'primary', disabled = false, className = '', ...props }) {
  const base = 'btn';
  const variantClass =
    variant === 'secondary' ? 'btn-secondary' :
    variant === 'success' ? 'btn-success' :
    variant === 'danger' ? 'btn-danger' : 'btn-primary';
  const disabledClass = disabled ? 'btn-disabled' : '';
  return (
    <button
      className={`${base} ${variantClass} ${disabledClass} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
