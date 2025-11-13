import React from 'react';
import './index.css';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Header } from './components/Header';
import { Login } from './pages/Login';
import { Submit } from './pages/Submit';
import { ProtectedRoute } from './routes/ProtectedRoute';

/**
 * PUBLIC_INTERFACE
 * App
 * Root application component providing routing and authentication context.
 * Routes:
 * - /login: public login page
 * - /submit: protected weekly report submission page
 * - /: redirects to /submit (protected)
 */
function App() {
  // Router MUST be above AuthProvider to ensure useNavigate/useLocation inside provider have context
  return (
    <BrowserRouter>
      <AuthProvider>
        <Header />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/submit"
            element={
              <ProtectedRoute>
                <Submit />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/submit" replace />} />
          <Route path="*" element={<Navigate to="/submit" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

/**
 * PUBLIC_INTERFACE
 * RequireAuth
 * Small wrapper used locally to protect /submit without separate file import.
 */
function RequireAuth({ children }) {
  // Reuse logic but avoid importing another component to keep bundle small
  // We still use the canonical useAuth hook
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { session, loading } = require('./contexts/AuthContext').useAuth();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const location = require('react-router-dom').useLocation();

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

export default App;
