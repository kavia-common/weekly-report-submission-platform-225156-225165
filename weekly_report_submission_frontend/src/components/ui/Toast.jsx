import React, { useEffect } from 'react';

/**
 * PUBLIC_INTERFACE
 * Toast
 * Non-intrusive top-right toast message.
 */
export function Toast({ type = 'success', children, onClose }) {
  useEffect(() => {
    const id = setTimeout(() => onClose?.(), 3500);
    return () => clearTimeout(id);
  }, [onClose]);

  const typeClass = type === 'error' ? 'toast-error' : 'toast-success';

  return (
    <div role="status" aria-live="polite" className={`toast ${typeClass}`}>
      <div className="flex items-center gap-2">
        <span aria-hidden="true">
          {type === 'error' ? '⚠️' : '✅'}
        </span>
        <span>{children}</span>
        <button
          type="button"
          onClick={onClose}
          className="ml-3 text-sm text-gray-600 hover:text-gray-800"
          aria-label="Close notification"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
