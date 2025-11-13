import React from 'react';

/**
 * PUBLIC_INTERFACE
 * DateInput
 * Labeled date input with validation styling and optional min/max.
 */
export function DateInput({ id, label, value, onChange, required = false, error, min, max, ...props }) {
  return (
    <div>
      <label htmlFor={id} className="label">
        {label} {required && <span className="text-red-600" aria-hidden="true">*</span>}
      </label>
      <input
        id={id}
        name={id}
        type="date"
        className={`input ${error ? 'input-error' : ''}`}
        value={value}
        onChange={onChange}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        required={required}
        min={min}
        max={max}
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
