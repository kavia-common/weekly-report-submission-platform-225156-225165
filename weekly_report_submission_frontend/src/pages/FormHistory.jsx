import React, { useMemo, useRef, useState } from 'react';
import './form-history.css';
import { Modal } from '../components/Modal';

/**
 * PUBLIC_INTERFACE
 * FormHistory
 * Minimal Form History page content.
 * Renders only a single container with the page title and the card grid, relying on global layout (Header) for nav.
 * Adds a simple modal to view more information for any card with placeholder data.
 */
export function FormHistory() {
  // Modal state
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const primaryActionRef = useRef(null);

  // Dummy data for modal fields; allow nullable fields for some
  const makeDummyReport = (title) => ({
    title,
    progress: 'Wrapped up core module integration and updated documentation.',
    blockers: 'Pending API keys from vendor; flaky CI job intermittently failing.',
    resolutions: 'Introduced retry with backoff on CI; vendor ticket opened.', // nullable candidate
    help_needed: null, // demonstrate nullable
    key_learnings: 'Improved deployment times by caching node_modules.',
    next_week_plan: 'Finalize metrics dashboard, start QA round.',
    created_at: new Date().toISOString(),
  });

  const cards = useMemo(
    () => [
      { id: '1', title: 'Form from November 1st' },
      { id: '2', title: 'Form from November 3rd' },
      { id: '3', title: 'Form from November 3rd' },
      { id: '4', title: 'Form from November 3rd' },
      { id: '5', title: 'Form from November 3rd' },
      { id: '6', title: 'Form from November 3rd' },
    ],
    []
  );

  const openModal = (card) => {
    setSelected(makeDummyReport(card.title));
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
    setSelected(null);
  };

  // Helper to render nullable fields gracefully
  const renderField = (label, value) => (
    <div className="mb-3">
      <div className="text-sm font-medium text-gray-600">{label}</div>
      <div className="text-gray-900">
        {value && String(value).trim() ? value : <span className="text-gray-400">None</span>}
      </div>
    </div>
  );

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

          {/* Card Grid */}
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
                    className="text-base text-gray-900 mb-4"
                    style={{ position: 'static', left: 'auto', top: 'auto', width: 'auto', height: 'auto' }}
                  >
                    I advanced in my assingment
                  </p>
                  <div
                    className="text-sm font-medium text-gray-500 mb-1"
                    aria-label="Section"
                    style={{ position: 'static', left: 'auto', top: 'auto', width: 'auto', height: 'auto' }}
                  >
                    Blockers
                  </div>
                  <p
                    className="text-base text-gray-900 mb-4"
                    style={{ position: 'static', left: 'auto', top: 'auto', width: 'auto', height: 'auto' }}
                  >
                    There is a big issue with the platform
                  </p>
                  <div
                    className="text-sm font-medium text-gray-500 mb-1"
                    aria-label="Section"
                    style={{ position: 'static', left: 'auto', top: 'auto', width: 'auto', height: 'auto' }}
                  >
                    Resolutions
                  </div>
                  <p
                    className="text-base text-gray-900"
                    style={{ position: 'static', left: 'auto', top: 'auto', width: 'auto', height: 'auto' }}
                  >
                    I fixed 3 bugs
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
        </div>
      </div>

      {/* Modal with dummy content */}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title={selected?.title || 'Report details'}
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
