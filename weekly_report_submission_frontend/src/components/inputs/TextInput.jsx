import React from 'react';

/**
 * PUBLIC_INTERFACE
 * TextInput
 * Labeled text input with validation styling.
 */
export function TextInput({ id, label, value, onChange, required = false, error, ...props }) {
  return (
    <div>
      <label htmlFor={id} className="label">
        {label} {required && <span className="text-red-600" aria-hidden="true">*</span>}
      </label>
      <input
        id={id}
        name={id}
        type="text"
        className={`input ${error ? 'input-error' : ''}`}
        value={value}
        onChange={onChange}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        required={required}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
