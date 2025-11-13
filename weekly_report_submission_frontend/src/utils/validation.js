/**
 * PUBLIC_INTERFACE
 * validateWeeklyReport
 * Validates the weekly report form data.
 * - name: required
 * - weekStart, weekEnd: required, weekEnd >= weekStart
 * - accomplishments: required
 * @param {Object} form
 * @returns {{valid: boolean, errors: Record<string,string>}}
 */
export function validateWeeklyReport(form) {
  const errors = {};

  if (!form.name || !form.name.trim()) {
    errors.name = 'Name is required.';
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

  if (!form.accomplishments || !form.accomplishments.trim()) {
    errors.accomplishments = 'Accomplishments are required.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}
