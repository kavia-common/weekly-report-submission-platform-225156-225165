/**
 * PUBLIC_INTERFACE
 * validateWeeklyReport
 * Validates the weekly report form data.
 * - author_name: required
 * - progress: required
 * Other fields optional but trimmed.
 * @param {Object} form
 * @returns {{valid: boolean, errors: Record<string,string>}}
 */
export function validateWeeklyReport(form) {
  const errors = {};

  if (!form.author_name || !form.author_name.trim()) {
    errors.author_name = 'Your name is required.';
  }

  if (!form.progress || !form.progress.trim()) {
    errors.progress = 'Progress is required.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}
