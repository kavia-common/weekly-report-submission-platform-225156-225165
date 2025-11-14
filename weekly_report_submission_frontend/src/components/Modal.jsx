import React, { useEffect, useRef } from 'react';

/**
 * PUBLIC_INTERFACE
 * Modal
 * Accessible modal dialog with backdrop and close controls.
 *
 * Props:
 * - isOpen: boolean - controls visibility
 * - onClose: function - called when modal should close (ESC, overlay click, close button)
 * - title: string - dialog title
 * - children: ReactNode - modal body content
 * - initialFocusRef?: ref - optional element to focus when opened
 */
export function Modal({ isOpen, onClose, title = 'Details', children, initialFocusRef }) {
  const overlayRef = useRef(null);
  const closeBtnRef = useRef(null);
  const headingId = 'modal-heading';
  const dialogRef = useRef(null);

  // Handle ESC to close and basic focus management
  useEffect(() => {
    if (!isOpen) return;

    function onKeyDown(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose?.();
      }
      // Simple focus trap
      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener('keydown', onKeyDown, true);

    // Focus management: prefer provided ref else close button
    const t = setTimeout(() => {
      if (initialFocusRef?.current) {
        initialFocusRef.current.focus();
      } else {
        closeBtnRef.current?.focus();
      }
    }, 0);

    return () => {
      clearTimeout(t);
      document.removeEventListener('keydown', onKeyDown, true);
    };
  }, [isOpen, onClose, initialFocusRef]);

  if (!isOpen) return null;

  const onOverlayClick = (e) => {
    if (e.target === overlayRef.current) {
      onClose?.();
    }
  };

  return (
    <div
      ref={overlayRef}
      onMouseDown={onOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      aria-hidden="false"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        className="relative w-full max-w-2xl mx-4"
      >
        {/* Card */}
        <div className="card bg-white border border-amber-100 p-6">
          <div className="flex items-start justify-between">
            <h2 id={headingId} className="text-xl font-semibold text-gray-900">
              {title}
            </h2>
            <button
              type="button"
              ref={closeBtnRef}
              onClick={onClose}
              aria-label="Close dialog"
              className="ml-4 inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              title="Close"
            >
              ✕
            </button>
          </div>

          <div className="mt-4">
            {children}
          </div>

          <div className="mt-6 flex items-center justify-end">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary px-4 py-2"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
