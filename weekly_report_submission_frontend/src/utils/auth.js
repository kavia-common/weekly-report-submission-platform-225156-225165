import { supabase } from './supabaseClient';

/**
 * PUBLIC_INTERFACE
 * validateCredentials
 * Basic input validation for email/password auth.
 * - email: non-empty, rudimentary format check
 * - password: at least 6 characters (configurable)
 *
 * @param {string} email
 * @param {string} password
 * @param {number} [minPasswordLength=6]
 * @returns {{ valid: boolean, errors: Record<string,string> }}
 */
export function validateCredentials(email, password, minPasswordLength = 6) {
  const errors = {};
  const trimmedEmail = (email || '').trim();
  const trimmedPassword = (password || '').trim();

  if (!trimmedEmail) {
    errors.email = 'Email is required.';
  } else if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!trimmedPassword) {
    errors.password = 'Password is required.';
  } else if (trimmedPassword.length < minPasswordLength) {
    errors.password = `Password must be at least ${minPasswordLength} characters.`;
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * PUBLIC_INTERFACE
 * signUpWithEmail
 * Registers a new user via Supabase email/password.
 * Uses REACT_APP_FRONTEND_URL for emailRedirectTo if available.
 *
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{user:any, session:any, error: Error|null, needsVerification: boolean}>}
 */
export async function signUpWithEmail(email, password) {
  const siteUrl = process.env.REACT_APP_FRONTEND_URL || window.location.origin;
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${siteUrl}/submit`
    }
  });

  // Supabase may require email confirmation depending on project settings
  const needsVerification = Boolean(data?.user) && !data?.session;

  return {
    user: data?.user ?? null,
    session: data?.session ?? null,
    error,
    needsVerification
  };
}

/**
 * PUBLIC_INTERFACE
 * signInWithEmail
 * Signs in an existing user via email/password.
 *
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{user:any, session:any, error: Error|null}>}
 */
export async function signInWithEmail(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  return {
    user: data?.user ?? null,
    session: data?.session ?? null,
    error
  };
}

/**
 * PUBLIC_INTERFACE
 * signOut
 * Signs the current user out.
 *
 * @returns {Promise<void>}
 */
export async function signOut() {
  await supabase.auth.signOut();
}
