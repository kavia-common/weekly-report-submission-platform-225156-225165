/**
 * PUBLIC_INTERFACE
 * validateWeeklyReport
 * Validates the weekly report form data for the new schema.
 * - author_name: required
 * - weekStart, weekEnd: required, weekEnd >= weekStart
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

  if (!form.weekStart) {
    errors.weekStart = 'Week start date is required.';
  }

  if (!form.weekEnd) {
    errors.weekEnd = 'Week end date is required.';
  }

  if (form.weekStart && form.weekEnd) {
    try {
      const start = new Date(form.weekStart);
      const end = new Date(form.weekEnd);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        if (isNaN(start.getTime())) errors.weekStart = 'Invalid start date.';
        if (isNaN(end.getTime())) errors.weekEnd = 'Invalid end date.';
      } else if (end < start) {
        errors.weekEnd = 'End date must be on or after start date.';
      }
    } catch {
      errors.weekStart = errors.weekStart || 'Invalid start date.';
      errors.weekEnd = errors.weekEnd || 'Invalid end date.';
    }
  }

  if (!form.progress || !form.progress.trim()) {
    errors.progress = 'Progress is required.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}
