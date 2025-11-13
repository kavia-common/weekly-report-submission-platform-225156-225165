import { supabase } from '../utils/supabaseClient';

/**
 * PUBLIC_INTERFACE
 * createWeeklyReport
 * Inserts a weekly report row into the 'weekly_reports' Supabase table.
 * @param {Object} payload - The report data.
 * @param {string} payload.author_name
 * @param {string} payload.progress
 * @param {string} [payload.blockers]
 * @param {string} [payload.resolutions]
 * @param {string} [payload.help_needed]
 * @param {string} [payload.key_learnings]
 * @param {string} [payload.next_week_plan]
 * @returns {Promise<Object>} The inserted row object.
 * @throws {Error} If the insert fails.
 */
export async function createWeeklyReport(payload) {

  const { data, error } = await supabase
    .from('weekly_reports')
    .insert([payload])
    .select('*')
    .single();

  if (error) {
    // Do not include secrets or detailed payload in error
    throw new Error(error.message || 'Failed to create weekly report');
  }
  return data;
}
