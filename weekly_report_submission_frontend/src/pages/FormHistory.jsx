import React, { useEffect, useMemo, useRef, useState } from 'react';
import './form-history.css';
import { Modal } from '../components/Modal';
import { supabase } from '../utils/supabaseClient';

/**
 * PUBLIC_INTERFACE
 * FormHistory
 * Fetches and displays weekly reports for the currently authenticated user
 * from Supabase as a grid of cards. The "More info" button opens a modal
 * populated with the selected report’s actual data.
 *
 * Behavior:
 * - On mount: tries to get current session and user.
 * - If user available: queries weekly_reports filtered by user_id,
 *   ordered by created_at desc.
 * - Shows Tailwind-styled loading and error states.
 * - Gracefully handles empty state and missing session.
 */
export function FormHistory() {
  // UI state
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal state
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const primaryActionRef = useRef(null);

  // Helper to render nullable fields gracefully
  const renderField = (label, value) => (
    <div className="mb-3">
      <div className="text-sm font-medium text-gray-600">{label}</div>
      <div className="text-gray-900">
        {value && String(value).trim() ? value : <span className="text-gray-400">None</span>}
      </div>
    </div>
  );

  // Compute card title from created_at
  const makeTitle = (createdAt) => {
    try {
      const d = new Date(createdAt);
      return `Form from ${d.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}`;
    } catch {
      return 'Form';
    }
  };

  // Map DB rows to card model for grid display
  const cards = useMemo(() => {
    return reports.map((r, idx) => ({
      id: r.id ?? String(idx),
      title: makeTitle(r.created_at),
      preview: {
        progress: r.progress,
        blockers: r.blockers,
        resolutions: r.resolutions,
      },
      full: r,
    }));
  }, [reports]);

  // Load current user and fetch their reports
  useEffect(() => {
    let isMounted = true;

    async function load() {
      setLoading(true);
      setError('');

      try {
        // Get current session/user
        const {
          data: { session },
          error: sessErr,
        } = await supabase.auth.getSession();

        if (sessErr) {
          if (isMounted) {
            setError('Unable to verify authentication.');
            setReports([]);
            setLoading(false);
          }
          return;
        }

        const user = session?.user || null;

        if (!user?.id) {
          // No session yet; show empty state
          if (isMounted) {
            setReports([]);
            setLoading(false);
          }
          return;
        }

        // Query weekly_reports table for this user
        // Selecting the requested fields; include id if available
        const { data, error } = await supabase
          .from('weekly_reports')
          .select('id, progress, blockers, resolutions, help_needed, key_learnings, next_week_plan, created_at, user_id')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          if (isMounted) {
            setError(error.message || 'Failed to load reports.');
            setReports([]);
          }
        } else if (isMounted) {
          setReports(Array.isArray(data) ? data : []);
        }
      } catch {
        if (isMounted) {
          setError('Something went wrong while loading your reports.');
          setReports([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();

    // Also listen for auth changes to refresh
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, _session) => {
      // Re-run load on any auth change
      load();
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe?.();
    };
  }, []);

  const openModal = (card) => {
    setSelected(card?.full || null);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelected(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-200">
      <div className="container mx-auto px-6 md:px-8 lg:px-12 py-8 md:py-12">
        <div
          id="screen_1-534"
          className="screen form-history-wrapper"
          role="document"
          aria-label="Form history screen"
        >
          {/* Page Title */}
          <h1
            id="title-1-535"
            className="text-3xl md:text-4xl font-semibold text-gray-900 mb-8 md:mb-12"
            style={{ position: 'static', left: 'auto', top: 'auto', width: 'auto', height: 'auto' }}
          >
            Form history
          </h1>

          {/* Loading state */}
          {loading && (
            <div className="flex items-center justify-center">
              <div className="card p-6 max-w-md w-full text-center">
                <p className="text-gray-700">Loading your reports...</p>
              </div>
            </div>
          )}

          {/* Error state */}
          {!loading && error && (
            <div className="flex items-center justify-center">
              <div className="card p-6 max-w-md w-full text-center border border-red-200 bg-red-50">
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Empty state (no session or no reports) */}
          {!loading && !error && cards.length === 0 && (
            <div className="flex items-center justify-center">
              <div className="card p-6 max-w-md w-full text-center">
                <p className="text-gray-700">No reports yet. Submit your first weekly report to see it here.</p>
              </div>
            </div>
          )}

          {/* Card Grid */}
          {!loading && !error && cards.length > 0 && (
            <section
              id="card-grid-1-592"
              aria-label="History cards grid"
              className="flex flex-wrap justify-center gap-6 md:gap-8"
              style={{ position: 'static', left: 'auto', top: 'auto', width: 'auto', height: 'auto' }}
            >
              {cards.map((c, idx) => (
                <article
                  key={c.id}
                  id={
                    idx === 0
                      ? 'card-1-593'
                      : idx === 1
                      ? 'card-2-1055'
                      : idx === 2
                      ? 'card-2-1067'
                      : idx === 3
                      ? 'card-2-1079'
                      : idx === 4
                      ? 'card-2-1091'
                      : 'card-2-1103'
                  }
                  className="bg-white rounded-xl shadow-lg p-6 flex flex-col w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] max-w-sm"
                  aria-labelledby={`card-${c.id}-title`}
                  style={{ position: 'static', left: 'auto', top: 'auto', width: 'auto', height: 'auto' }}
                >
                  <div className="flex-1 mb-4" role="group" aria-labelledby={`card-${c.id}-title`}>
                    <h2
                      id={`card-${c.id}-title`}
                      className="text-xl font-medium text-gray-900 mb-4"
                      style={{ position: 'static', left: 'auto', top: 'auto', width: 'auto', height: 'auto' }}
                    >
                      {c.title}
                    </h2>

                    <div
                      className="text-sm font-medium text-gray-500 mb-1"
                      aria-label="Section"
                      style={{ position: 'static', left: 'auto', top: 'auto', width: 'auto', height: 'auto' }}
                    >
                      Progress
                    </div>
                    <p
                      className="text-base text-gray-900 mb-4 line-clamp-2"
                      style={{ position: 'static', left: 'auto', top: 'auto', width: 'auto', height: 'auto' }}
                      title={c.preview.progress || ''}
                    >
                      {c.preview.progress || '—'}
                    </p>

                    <div
                      className="text-sm font-medium text-gray-500 mb-1"
                      aria-label="Section"
                      style={{ position: 'static', left: 'auto', top: 'auto', width: 'auto', height: 'auto' }}
                    >
                      Blockers
                    </div>
                    <p
                      className="text-base text-gray-900 mb-4 line-clamp-2"
                      style={{ position: 'static', left: 'auto', top: 'auto', width: 'auto', height: 'auto' }}
                      title={c.preview.blockers || ''}
                    >
                      {c.preview.blockers || '—'}
                    </p>

                    <div
                      className="text-sm font-medium text-gray-500 mb-1"
                      aria-label="Section"
                      style={{ position: 'static', left: 'auto', top: 'auto', width: 'auto', height: 'auto' }}
                    >
                      Resolutions
                    </div>
                    <p
                      className="text-base text-gray-900 line-clamp-2"
                      style={{ position: 'static', left: 'auto', top: 'auto', width: 'auto', height: 'auto' }}
                      title={c.preview.resolutions || ''}
                    >
                      {c.preview.resolutions || '—'}
                    </p>
                  </div>
                  <button
                    className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                    type="button"
                    aria-label={`More info about ${c.title}`}
                    onClick={() => openModal(c)}
                    style={{ position: 'static', left: 'auto', top: 'auto', width: 'auto', height: 'auto' }}
                  >
                    More info
                  </button>
                </article>
              ))}
            </section>
          )}
        </div>
      </div>

      {/* Modal with selected report content */}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title={selected ? makeTitle(selected.created_at) : 'Report details'}
        initialFocusRef={primaryActionRef}
      >
        {selected && (
          <div className="space-y-2">
            {renderField('Progress', selected.progress)}
            {renderField('Blockers', selected.blockers)}
            {renderField('Resolutions', selected.resolutions)}
            {renderField('Help needed', selected.help_needed)}
            {renderField('Key learnings', selected.key_learnings)}
            {renderField('Next week plan', selected.next_week_plan)}
            <div className="mt-4 text-sm text-gray-500">
              <span className="font-medium text-gray-600">Created at: </span>
              <time dateTime={selected.created_at}>
                {new Date(selected.created_at).toLocaleString()}
              </time>
            </div>

            {/* Hidden action to receive initial focus optionally */}
            <button
              ref={primaryActionRef}
              type="button"
              className="sr-only"
              aria-hidden="true"
              tabIndex={-1}
            >
              hidden focus target
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default FormHistory;
