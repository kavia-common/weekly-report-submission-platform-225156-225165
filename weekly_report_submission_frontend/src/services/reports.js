import { supabase } from '../utils/supabaseClient';

/**
 * PUBLIC_INTERFACE
 * createWeeklyReport
 * Inserts a weekly report row into the 'weekly_reports' Supabase table.
 * Automatically includes the authenticated user's id as user_id.
 *
 * @param {Object} payload - The report data.
 * @param {string} payload.author_name
 * @param {string} payload.progress
 * @param {string} [payload.blockers]
 * @param {string} [payload.resolutions]
 * @param {string} [payload.help_needed]
 * @param {string} [payload.key_learnings]
 * @param {string} [payload.next_week_plan]
 * @returns {Promise<Object>} The inserted row object.
 * @throws {Error} If the insert fails or if no authenticated user is found.
 */
export async function createWeeklyReport(payload) {
  // Fetch current auth session to obtain user.id
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    // Avoid leaking details; provide concise error
    throw new Error('Unable to verify authentication. Please try signing in again.');
  }

  const userId = session?.user?.id || null;

  // Graceful handling when no user is signed in:
  // If user_id is required by the DB schema, we should stop and inform the caller.
  // Otherwise, insert will proceed with null which may be rejected by RLS/constraints.
  if (!userId) {
    throw new Error('You must be signed in to submit a report.');
  }

  const insertPayload = {
    ...payload,
    user_id: userId,
  };

  const { data, error } = await supabase
    .from('weekly_reports')
    .insert([insertPayload])
    .select('*')
    .single();

  if (error) {
    // Do not include secrets or detailed payload in error
    throw new Error(error.message || 'Failed to create weekly report');
  }
  return data;
}
