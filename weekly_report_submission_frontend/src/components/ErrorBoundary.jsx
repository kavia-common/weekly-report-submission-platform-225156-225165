import React from 'react';

/**
 * Simple logger that avoids logging sensitive data.
 * Currently logs only message and stack presence.
 */
function safeLogError(error, info) {
  // Avoid logging any PII or secrets; no env contents, no payloads.
  // eslint-disable-next-line no-console
  console.error('UI ErrorBoundary captured an error', {
    message: error?.message,
    hasStack: Boolean(error?.stack),
    componentStackProvided: Boolean(info?.componentStack)
  });
}

/**
 * PUBLIC_INTERFACE
 * ErrorBoundary
 * Catches UI errors and renders a fallback.
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  // PUBLIC_INTERFACE
  static getDerivedStateFromError() {
    return { hasError: true };
  }

  // PUBLIC_INTERFACE
  componentDidCatch(error, info) {
    safeLogError(error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="card p-6 max-w-md text-center">
            <h2 className="text-xl font-semibold text-gray-800">Something went wrong</h2>
            <p className="text-gray-600 mt-2">Please refresh the page and try again.</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
