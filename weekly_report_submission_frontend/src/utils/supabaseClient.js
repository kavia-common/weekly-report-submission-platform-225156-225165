import { createClient } from '@supabase/supabase-js';

/**
 * PUBLIC_INTERFACE
 * supabase
 * Singleton Supabase client initialized using environment variables:
 * - REACT_APP_SUPABASE_URL
 * - REACT_APP_SUPABASE_KEY
 *
 * Do not hardcode credentials in code.
 */
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_KEY;

// Minimal defensive check; avoid throwing sensitive info
if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.warn('Supabase env vars are not fully configured. Set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY.');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');
