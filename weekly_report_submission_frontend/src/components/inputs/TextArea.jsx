import React from 'react';

/**
 * PUBLIC_INTERFACE
 * TextArea
 * Labeled textarea with validation styling.
 */
export function TextArea({ id, label, value, onChange, required = false, error, rows = 4, ...props }) {
  return (
    <div>
      <label htmlFor={id} className="label">
        {label} {required && <span className="text-red-600" aria-hidden="true">*</span>}
      </label>
      <textarea
        id={id}
        name={id}
        className={`input ${error ? 'input-error' : ''}`}
        value={value}
        onChange={onChange}
        rows={rows}
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
