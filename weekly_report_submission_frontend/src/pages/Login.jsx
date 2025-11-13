import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Toast } from '../components/ui/Toast';
import { Button } from '../components/ui/Button';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * Login
 * Presents a Google Sign-In button and handles auth errors gracefully.
 * Handles Supabase OAuth callback by cleaning hash and redirecting to the
 * originally requested route or /submit.
 */
export function Login() {
  const { signInWithGoogle, loading, session } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [toast, setToast] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Determine the post-login target, default to /submit
  const targetPath = useMemo(() => {
    const from = location.state && location.state.from && location.state.from.pathname;
    return from || '/submit';
  }, [location.state]);

  // On mount, if returning from Supabase with hash, show a small processing loader and let AuthContext redirect
  useEffect(() => {
    // If we already have a session, go directly to target
    if (session) {
      navigate(targetPath, { replace: true });
      return;
    }

    if (window.location.hash) {
      const hash = window.location.hash.replace(/^#/, '');
      const params = new URLSearchParams(hash);
      const looksLikeSupabase = ['access_token', 'refresh_token', 'code', 'type'].some((k) =>
        params.has(k)
      );
      if (looksLikeSupabase) {
        setProcessing(true);
        // AuthContext's onAuthStateChange will handle navigation after session is set.
      }
    }
  }, [session, navigate, targetPath]);

  const onLogin = async () => {
    try {
      await signInWithGoogle();
      // Redirect handled by Supabase OAuth redirectTo and then by AuthContext after callback
    } catch (err) {
      setToast({
        type: 'error',
        message: err?.message || 'Login failed. Please try again.'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-200">
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-md mx-auto card p-6 md:p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800">Sign in to Continue</h2>
          <p className="text-gray-600 mt-2">Use your Google account to submit your weekly report.</p>

          <div className="mt-6">
            <Button
              onClick={onLogin}
              disabled={loading || processing}
              className="w-full"
              variant="primary"
              aria-busy={processing}
            >
              {processing ? 'Finalizing sign-in…' : loading ? 'Loading…' : 'Continue with Google'}
            </Button>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            By continuing, you agree to our acceptable use and privacy guidelines.
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
