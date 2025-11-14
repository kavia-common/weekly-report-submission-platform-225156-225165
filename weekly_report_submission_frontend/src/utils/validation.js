/**
 * PUBLIC_INTERFACE
 * validateWeeklyReport
 * Validates the weekly report form data.
 * - progress: required
 * Other fields optional but trimmed.
 * @param {Object} form
 * @returns {{valid: boolean, errors: Record<string,string>}}
 */
export function validateWeeklyReport(form) {
  const errors = {};

  if (!form?.progress || !String(form.progress).trim()) {
    errors.progress = 'Progress is required.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}
