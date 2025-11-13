import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getSupabaseClient } from '../utils/supabaseClient';

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

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  const supabase = getSupabaseClient();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // PUBLIC_INTERFACE
  const signInWithGoogle = useCallback(async () => {
    // emailRedirectTo should point back to this app's URL
    const siteUrl = process.env.REACT_APP_FRONTEND_URL || window.location.origin;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${siteUrl}/submit`,
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

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      try {
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

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession ?? null);
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, [supabase]);

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
