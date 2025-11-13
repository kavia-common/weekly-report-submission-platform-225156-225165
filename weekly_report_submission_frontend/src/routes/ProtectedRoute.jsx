import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * PUBLIC_INTERFACE
 * ProtectedRoute
 * Wraps route element to require authenticated session.
 * If not authenticated and not loading, redirects to /login,
 * preserving the originally requested path in location.state.
 */
export function ProtectedRoute({ children }) {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card p-6">
          <p className="text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
