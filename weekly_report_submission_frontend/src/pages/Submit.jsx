import React, { useMemo, useState } from 'react';
import { createWeeklyReport } from '../services/reports';
import { validateWeeklyReport } from '../utils/validation';
import { TextInput } from '../components/inputs/TextInput';
import { TextArea } from '../components/inputs/TextArea';
import { Button } from '../components/ui/Button';
import { Toast } from '../components/ui/Toast';

/**
 * PUBLIC_INTERFACE
 * Submit
 * Weekly Report Submission form page (previous App content).
 */
export function Submit() {
  const [form, setForm] = useState({
    author_name: '',
    progress: '',
    blockers: '',
    resolutions: '',
    help_needed: '',
    key_learnings: '',
    next_week_plan: ''
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

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
      await createWeeklyReport({
        author_name: form.author_name.trim(),
        progress: form.progress.trim(),
        blockers: form.blockers.trim(),
        resolutions: form.resolutions.trim(),
        help_needed: form.help_needed.trim(),
        key_learnings: form.key_learnings.trim(),
        next_week_plan: form.next_week_plan.trim()
      });
      setToast({ type: 'success', message: 'Report submitted successfully.' });
      setForm({
        author_name: '',
        progress: '',
        blockers: '',
        resolutions: '',
        help_needed: '',
        key_learnings: '',
        next_week_plan: ''
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Report submission failed');
      setToast({
        type: 'error',
        message:
          typeof err?.message === 'string' && err.message.trim()
            ? err.message
            : 'Submission failed. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
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
  );
}
