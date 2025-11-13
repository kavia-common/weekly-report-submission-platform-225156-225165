import { createClient } from '@supabase/supabase-js';

/**
 * PUBLIC_INTERFACE
 * getSupabaseClient
 * Returns a singleton Supabase client instance, configured using environment variables.
 *
 * Required Environment Variables:
 * - REACT_APP_SUPABASE_URL: Supabase project URL
 * - REACT_APP_SUPABASE_KEY: Supabase anon/public key
 *
 * Security:
 * - Does not log secrets or full env values.
 * - Validates presence of required env vars and throws a user-friendly error.
 *
 * @returns {import('@supabase/supabase-js').SupabaseClient} Supabase client instance
 * @throws {Error} If required environment variables are missing.
 */
export function getSupabaseClient() {
  const url = process.env.REACT_APP_SUPABASE_URL;
  const key = process.env.REACT_APP_SUPABASE_KEY;

  // Basic validation without exposing values
  if (!url || !key) {
    // Avoid logging actual values
    // eslint-disable-next-line no-console
    console.error('Supabase env configuration is missing. Please set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY.');
    throw new Error('Supabase is not configured. Please contact the administrator.');
  }

  // Create a single instance across calls
  if (!window.__supabaseClient) {
    window.__supabaseClient = createClient(url, key, {
      auth: {
        // Keep default settings; adjust if needed
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }
  return window.__supabaseClient;
}
