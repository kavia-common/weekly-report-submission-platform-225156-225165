import React, { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { Toast } from '../components/ui/Toast';
import { Button } from '../components/ui/Button';
import { validateCredentials, signInWithEmail, signUpWithEmail } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * Login
 * Auth page supporting Google OAuth and email/password (sign in + register).
 * - Uses Supabase Auth via shared client.
 * - Validates email/password inputs (basic email check + min length).
 * - Shows inline errors and toasts; disables buttons while loading.
 * - On success, redirects to /submit.
 */
export function Login() {
  const [toast, setToast] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState({ google: false, signin: false, register: false });

  const navigate = useNavigate();

  const onDismissToast = () => setToast(null);

  // Existing Google sign-in preserved
  const signInWithGoogle = async () => {
    try {
      setLoading((l) => ({ ...l, google: true }));
      const siteUrl = process.env.REACT_APP_FRONTEND_URL || window.location.origin;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${siteUrl}/submit`,
        },
      });
      if (error) {
        setToast({
          type: 'error',
          message: error.message || 'Login failed. Please try again.',
        });
      }
    } catch (e) {
      setToast({
        type: 'error',
        message: 'Login failed. Please try again.',
      });
    } finally {
      setLoading((l) => ({ ...l, google: false }));
    }
  };

  const handleSignIn = async (e) => {
    e?.preventDefault?.();
    setFieldErrors({});
    const { valid, errors } = validateCredentials(email, password, 6);
    if (!valid) {
      setFieldErrors(errors);
      return;
    }
    setLoading((l) => ({ ...l, signin: true }));
    try {
      const { error } = await signInWithEmail(email.trim(), password);
      if (error) {
        setToast({
          type: 'error',
          message: error.message || 'Sign in failed. Please check your credentials.',
        });
        return;
      }
      // Success
      setToast({ type: 'success', message: 'Signed in successfully. Redirecting...' });
      // Small delay for UX then navigate
      setTimeout(() => navigate('/submit', { replace: true }), 400);
    } catch {
      setToast({ type: 'error', message: 'Sign in failed. Please try again.' });
    } finally {
      setLoading((l) => ({ ...l, signin: false }));
    }
  };

  const handleRegister = async (e) => {
    e?.preventDefault?.();
    setFieldErrors({});
    const { valid, errors } = validateCredentials(email, password, 6);
    if (!valid) {
      setFieldErrors(errors);
      return;
    }
    setLoading((l) => ({ ...l, register: true }));
    try {
      const { error, needsVerification, session } = await signUpWithEmail(email.trim(), password);
      if (error) {
        setToast({
          type: 'error',
          message: error.message || 'Registration failed. Please try again.',
        });
        return;
      }
      if (needsVerification && !session) {
        setToast({
          type: 'success',
          message: 'Check your email to confirm your account before signing in.',
        });
        return;
      }
      // If project does not require email confirmation, user may be signed in
      setToast({ type: 'success', message: 'Registered successfully. Redirecting...' });
      setTimeout(() => navigate('/submit', { replace: true }), 400);
    } catch {
      setToast({ type: 'error', message: 'Registration failed. Please try again.' });
    } finally {
      setLoading((l) => ({ ...l, register: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-200">
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-md mx-auto card p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-800 text-center">Welcome</h2>
          <p className="text-gray-600 mt-2 text-center">
            Sign in to submit your weekly report.
          </p>

          {/* Email/Password Form */}
          <form className="mt-6 space-y-4" onSubmit={handleSignIn} noValidate>
            <div>
              <label htmlFor="email" className="label">
                Email <span className="text-red-600" aria-hidden="true">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                className={`input ${fieldErrors.email ? 'input-error' : ''}`}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={Boolean(fieldErrors.email)}
                aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                required
              />
              {fieldErrors.email && (
                <p id="email-error" className="mt-1 text-sm text-red-600">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="label">
                Password <span className="text-red-600" aria-hidden="true">*</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className={`input ${fieldErrors.password ? 'input-error' : ''}`}
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={Boolean(fieldErrors.password)}
                aria-describedby={fieldErrors.password ? 'password-error' : undefined}
                required
              />
              {fieldErrors.password && (
                <p id="password-error" className="mt-1 text-sm text-red-600">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={loading.signin}
                aria-busy={loading.signin}
              >
                {loading.signin ? 'Signing In...' : 'Sign In'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="w-full"
                onClick={handleRegister}
                disabled={loading.register}
                aria-busy={loading.register}
              >
                {loading.register ? 'Registering...' : 'Register'}
              </Button>
            </div>
          </form>

          {/* Divider */}
          <div className="mt-6 flex items-center">
            <div className="flex-1 border-t border-gray-200" />
            <span className="px-3 text-xs text-gray-500">or</span>
            <div className="flex-1 border-t border-gray-200" />
          </div>

          {/* Google Sign-In */}
          <div className="mt-6">
            <Button
              onClick={signInWithGoogle}
              className="w-full"
              variant="primary"
              disabled={loading.google}
              aria-busy={loading.google}
              aria-label="Sign in with Google"
            >
              {loading.google ? 'Redirecting...' : 'Sign in with Google'}
            </Button>
          </div>

          <p className="text-xs text-gray-500 mt-4 text-center">
            By continuing, you agree to our acceptable use and privacy guidelines.
          </p>
        </div>
      </div>

      {toast && (
        <Toast type={toast.type} onClose={onDismissToast}>
          {toast.message}
        </Toast>
      )}
    </div>
  );
}
