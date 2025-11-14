import React, { useEffect, useState } from 'react';
import { Toast } from '../components/ui/Toast';
import { Button } from '../components/ui/Button';
import { validateCredentials, signInWithEmail, signUpWithEmail } from '../utils/auth';
import { supabase } from '../utils/supabaseClient';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const [mode, setMode] = useState('signin'); // 'signin' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    // If already authenticated, go to submit
    let mounted = true;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted && session) {
        navigate('/submit', { replace: true });
      }
    });
    return () => { mounted = false; };
  }, [navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const { valid, errors: fieldErrors } = validateCredentials(email, password, 6);
    if (!valid) {
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    try {
      if (mode === 'register') {
        const { error, needsVerification } = await signUpWithEmail(email.trim(), password.trim());
        if (error) {
          setToast({
            type: 'error',
            message: error.message || 'Registration failed. Please try again.'
          });
        } else if (needsVerification) {
          setToast({
            type: 'success',
            message: 'Registration successful. Please check your email to verify your account.'
          });
        } else {
          // If auto session is created (may depend on Supabase config)
          setToast({ type: 'success', message: 'Registered successfully.' });
          navigate('/submit', { replace: true });
        }
      } else {
        const { error } = await signInWithEmail(email.trim(), password.trim());
        if (error) {
          setToast({
            type: 'error',
            message: error.message || 'Sign in failed. Please try again.'
          });
        } else {
          setToast({ type: 'success', message: 'Signed in successfully.' });
          navigate('/submit', { replace: true });
        }
      }
    } catch (err) {
      setToast({
        type: 'error',
        message: 'Something went wrong. Please try again.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const switchMode = () => {
    setMode((m) => (m === 'signin' ? 'register' : 'signin'));
    setErrors({});
    setToast(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-200">
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-md mx-auto card p-6 md:p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">
              {mode === 'signin' ? 'Sign in to Continue' : 'Create your account'}
            </h2>
            <p className="text-gray-600 mt-2">
              {mode === 'signin'
                ? 'Enter your email and password to access the submission form.'
                : 'Register with your email to submit your weekly reports.'}
            </p>
          </div>

          <form onSubmit={onSubmit} noValidate className="mt-6">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="email" className="label">
                  Email <span className="text-red-600" aria-hidden="true">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={`input ${errors.email ? 'input-error' : ''}`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  required
                />
                {errors.email && (
                  <p id="email-error" className="mt-1 text-sm text-red-600">
                    {errors.email}
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
                  className={`input ${errors.password ? 'input-error' : ''}`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  required
                />
                {errors.password && (
                  <p id="password-error" className="mt-1 text-sm text-red-600">
                    {errors.password}
                  </p>
                )}
              </div>

              <Button type="submit" variant="primary" disabled={submitting} className="mt-2">
                {submitting
                  ? (mode === 'signin' ? 'Signing in...' : 'Registering...')
                  : (mode === 'signin' ? 'Sign In' : 'Register')}
              </Button>
            </div>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={switchMode}
              className="text-sm text-amber-700 hover:text-amber-800 underline"
            >
              {mode === 'signin'
                ? "Don't have an account? Register"
                : 'Already have an account? Sign in'}
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-4 text-center">
            We do not log sensitive information. Credentials are handled securely by Supabase.
          </p>
        </div>
      </div>
      {toast && (
        <Toast type={toast.type} onClose={() => setToast(null)}>
          {toast.message}
        </Toast>
      )}
    </div>
  );
}
