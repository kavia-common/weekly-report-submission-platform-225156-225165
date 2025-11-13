import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getSupabaseClient } from '../utils/supabaseClient';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * AuthContext
 * Provides authentication session and actions via Supabase.
 *
 * Exposes:
 * - session: Supabase session object or null
 * - user: Supabase user object or null
 * - loading: boolean while resolving initial auth state
 * - signInWithGoogle(): initiates Google OAuth
 * - signOut(): signs the user out
 */
const AuthContext = createContext({
  session: null,
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {}
});

// Helper to remove Supabase hash fragments from the URL (access_token, refresh_token etc.)
function cleanAuthHashFromUrl() {
  if (typeof window === 'undefined') return;
  if (!window.location.hash) return;

  const hash = window.location.hash.replace(/^#/, '');
  const params = new URLSearchParams(hash);

  const authKeys = [
    'access_token',
    'refresh_token',
    'expires_in',
    'token_type',
    'provider_token',
    'provider_refresh_token',
    'type',
    'code'
  ];

  let hasAuth = false;
  authKeys.forEach((k) => {
    if (params.has(k)) {
      hasAuth = true;
      params.delete(k);
    }
  });

  if (hasAuth) {
    const newHash = params.toString();
    const newUrl =
      window.location.pathname +
      window.location.search +
      (newHash ? `#${newHash}` : '');
    window.history.replaceState({}, document.title, newUrl);
  }
}

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  const supabase = getSupabaseClient();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // PUBLIC_INTERFACE
  const signInWithGoogle = useCallback(async () => {
    // Redirect back to /login so we can process and forward accordingly
    const siteUrl = process.env.REACT_APP_FRONTEND_URL || window.location.origin;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${siteUrl}/login`,
        queryParams: {
          prompt: 'select_account'
        }
      }
    });
    if (error) {
      // eslint-disable-next-line no-console
      console.error('Google sign-in failed');
      throw new Error(error.message || 'Google sign-in failed');
    }
  }, [supabase]);

  // PUBLIC_INTERFACE
  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      // eslint-disable-next-line no-console
      console.error('Sign out failed');
      throw new Error(error.message || 'Sign out failed');
    }
  }, [supabase]);

  // Initialize session and clean up auth hash if present
  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      try {
        // If Supabase redirected back with hash tokens, remove them from the URL bar
        cleanAuthHashFromUrl();

        const { data } = await supabase.auth.getSession();
        if (!isMounted) return;
        setSession(data.session ?? null);
      } catch {
        // eslint-disable-next-line no-console
        console.error('Failed to get session');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    init();

    // Safe navigation helper to avoid calling useNavigate too early
    const safeNavigate = (to) => {
      try {
        if (typeof navigate === 'function') {
          navigate(to, { replace: true });
        } else if (typeof window !== 'undefined') {
          // Fallback if hook is not ready (shouldn't happen when wrapped correctly)
          window.location.replace(to);
        }
      } catch {
        if (typeof window !== 'undefined') {
          window.location.replace(to);
        }
      }
    };

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession ?? null);

      // Only handle navigation after initial loading is complete to avoid early Router usage
      if (newSession) {
        // Prefer state.from pathname saved by ProtectedRoute, fallback to /submit
        const stateFrom = location.state && location.state.from && location.state.from.pathname;
        const target = stateFrom || '/submit';
        // Ensure hash tokens are removed before navigation
        cleanAuthHashFromUrl();

        // Defer to next tick to ensure Router context is fully established
        setTimeout(() => safeNavigate(target), 0);
      }
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, [supabase, navigate, location.state]);

  const value = {
    session,
    user: session?.user ?? null,
    loading,
    signInWithGoogle,
    signOut
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// PUBLIC_INTERFACE
export function useAuth() {
  /** Hook to access AuthContext values. */
  return useContext(AuthContext);
}
