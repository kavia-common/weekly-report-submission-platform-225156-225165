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
  const [form, setForm] = useState({
    name: '',
    weekStart: '',
    weekEnd: '',
    accomplishments: '',
    blockers: '',
    nextWeek: '',
    notes: ''
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
      await createWeeklyReport({
        name: form.name.trim(),
        week_start: form.weekStart,
        week_end: form.weekEnd,
        accomplishments: form.accomplishments.trim(),
        blockers: form.blockers.trim(),
        next_week: form.nextWeek.trim(),
        notes: form.notes.trim()
      });
      setToast({ type: 'success', message: 'Report submitted successfully.' });
      // Clear form after success
      setForm({
        name: '',
        weekStart: '',
        weekEnd: '',
        accomplishments: '',
        blockers: '',
        nextWeek: '',
        notes: ''
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
                  id="name"
                  label="Name"
                  value={form.name}
                  onChange={onChange('name')}
                  required
                  error={errors.name}
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
                  id="accomplishments"
                  label="Accomplishments"
                  value={form.accomplishments}
                  onChange={onChange('accomplishments')}
                  required
                  error={errors.accomplishments}
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
                  id="nextWeek"
                  label="Next Week Plan"
                  value={form.nextWeek}
                  onChange={onChange('nextWeek')}
                  rows={4}
                />

                <TextArea
                  id="notes"
                  label="Notes (Optional)"
                  value={form.notes}
                  onChange={onChange('notes')}
                  rows={3}
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
