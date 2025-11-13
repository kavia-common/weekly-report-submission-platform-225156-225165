import React, { useMemo, useState } from 'react';
import './index.css';
import './App.css';
import { createWeeklyReport } from './services/reports';
import { validateWeeklyReport } from './utils/validation';
import { ErrorBoundary } from './components/ErrorBoundary';
import { TextInput } from './components/inputs/TextInput';
import { DateInput } from './components/inputs/DateInput';
import { TextArea } from './components/inputs/TextArea';
import { Button } from './components/ui/Button';
import { Toast } from './components/ui/Toast';

/**
 * Weekly Report Submission Single Page
 * Champagne theme, centered container, Tailwind-styled.
 */

// PUBLIC_INTERFACE
function App() {
  // Updated form state to match new schema fields
  const [form, setForm] = useState({
    author_name: '',
    weekStart: '',
    weekEnd: '',
    progress: '',
    blockers: '',
    resolutions: '',
    help_needed: '',
    key_learnings: '',
    next_week_plan: ''
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'success'|'error', message: string }

  const onChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
  };

  const onDismissToast = () => setToast(null);

  const headerGradient = useMemo(
    () => 'bg-gradient-to-br from-amber-50 to-amber-200',
    []
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const result = validateWeeklyReport(form);
    if (!result.valid) {
      setErrors(result.errors);
      return;
    }

    setSubmitting(true);
    try {
      // Map to DB fields according to new schema
      await createWeeklyReport({
        author_name: form.author_name.trim(),
        week_start: form.weekStart,
        week_end: form.weekEnd,
        progress: form.progress.trim(),
        blockers: form.blockers.trim(),
        resolutions: form.resolutions.trim(),
        help_needed: form.help_needed.trim(),
        key_learnings: form.key_learnings.trim(),
        next_week_plan: form.next_week_plan.trim()
        // created_at is defaulted by DB
      });
      setToast({ type: 'success', message: 'Report submitted successfully.' });
      // Clear form after success
      setForm({
        author_name: '',
        weekStart: '',
        weekEnd: '',
        progress: '',
        blockers: '',
        resolutions: '',
        help_needed: '',
        key_learnings: '',
        next_week_plan: ''
      });
    } catch (err) {
      // Avoid logging secrets; only log generic error
      console.error('Report submission failed'); // safe generic log
      setToast({ type: 'error', message: err?.message || 'Submission failed. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ErrorBoundary>
      <div className={`min-h-screen ${headerGradient}`}>
        <main className="container mx-auto px-4 py-10">
          <div className="max-w-3xl mx-auto card p-6 md:p-8">
            <header className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Weekly Report Submission</h1>
              <p className="text-gray-600 mt-1">Please fill in the details for your weekly report.</p>
            </header>

            <form onSubmit={handleSubmit} noValidate>
              <div className="grid grid-cols-1 gap-5">
                <TextInput
                  id="author_name"
                  label="Your Name"
                  value={form.author_name}
                  onChange={onChange('author_name')}
                  required
                  error={errors.author_name}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <DateInput
                    id="weekStart"
                    label="Week Start"
                    value={form.weekStart}
                    onChange={onChange('weekStart')}
                    required
                    error={errors.weekStart}
                  />
                  <DateInput
                    id="weekEnd"
                    label="Week End"
                    value={form.weekEnd}
                    onChange={onChange('weekEnd')}
                    required
                    error={errors.weekEnd}
                    min={form.weekStart || undefined}
                  />
                </div>

                <TextArea
                  id="progress"
                  label="Progress"
                  value={form.progress}
                  onChange={onChange('progress')}
                  required
                  error={errors.progress}
                  rows={5}
                />

                <TextArea
                  id="blockers"
                  label="Blockers"
                  value={form.blockers}
                  onChange={onChange('blockers')}
                  rows={4}
                />

                <TextArea
                  id="resolutions"
                  label="Resolutions"
                  value={form.resolutions}
                  onChange={onChange('resolutions')}
                  rows={4}
                />

                <TextArea
                  id="help_needed"
                  label="Help Needed"
                  value={form.help_needed}
                  onChange={onChange('help_needed')}
                  rows={4}
                />

                <TextArea
                  id="key_learnings"
                  label="Key Learnings"
                  value={form.key_learnings}
                  onChange={onChange('key_learnings')}
                  rows={4}
                />

                <TextArea
                  id="next_week_plan"
                  label="Next Week Plan"
                  value={form.next_week_plan}
                  onChange={onChange('next_week_plan')}
                  rows={4}
                />

                <div className="flex items-center justify-end pt-2">
                  <Button type="submit" variant="primary" disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit Report'}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </main>
        {toast && (
          <Toast type={toast.type} onClose={onDismissToast}>
            {toast.message}
          </Toast>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;
