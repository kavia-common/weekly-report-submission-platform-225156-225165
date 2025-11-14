import React from 'react';
import './form-history.css';

/**
 * PUBLIC_INTERFACE
 * FormHistory
 * Minimal Form History page content.
 * Renders only a single container with the page title and the card grid, relying on global layout (Header) for nav.
 */
export function FormHistory() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-200">
      {/* Centering wrapper: one top-level container using Tailwind to center content */}
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-screen-xl mx-auto">
          <div
            id="screen_1-534"
            className="screen form-history-wrapper mx-auto"
            role="document"
            aria-label="Form history screen"
            style={{ position: 'relative', maxWidth: 1440 }}
          >
            {/* Page Title */}
            <div className="w-full flex justify-center">
              <h1 id="title-1-535" className="typo-4 text-center">Form history</h1>
            </div>

            {/* Card Grid */}
            <section
              id="card-grid-1-592"
              aria-label="History cards grid"
              className="mx-auto"
            >
              {/* Card 1 */}
              <article id="card-1-593" className="card" aria-labelledby="card-1-title">
                <div className="copy" role="group" aria-labelledby="card-1-title">
                  <h2 id="card-1-title" className="t-title typo-7">Form from November 1st</h2>
                  <div className="t-section-1 typo-8" aria-label="Section">Progress</div>
                  <p className="t-text-1 typo-5">I advanced in my assingment</p>
                  <div className="t-section-2 typo-8" aria-label="Section">Blockers</div>
                  <p className="t-text-2 typo-5">There is a big issue with the platform</p>
                  <div className="t-section-3 typo-8" aria-label="Section">Resolutions</div>
                  <p className="t-text-3 typo-5">I fixed 3 bugs</p>
                </div>
                <div className="btn btn-style-4" role="none presentation">
                  <button className="text typo-6" type="button" aria-label="More info about Form from November 1st">More info</button>
                </div>
              </article>

              {/* Card 2 */}
              <article id="card-2-1055" className="card" aria-labelledby="card-2-title">
                <div className="copy" role="group" aria-labelledby="card-2-title">
                  <h2 id="card-2-title" className="t-title typo-7">Form from November 3rd</h2>
                  <div className="t-section-1 typo-8">Progress</div>
                  <p className="t-text-1 typo-5">I advanced in my assingment</p>
                  <div className="t-section-2 typo-8">Blockers</div>
                  <p className="t-text-2 typo-5">There is a big issue with the platform</p>
                  <div className="t-section-3 typo-8">Resolutions</div>
                  <p className="t-text-3 typo-5">I fixed 3 bugs</p>
                </div>
                <div className="btn btn-style-4">
                  <button className="text typo-6" type="button" aria-label="More info about Form from November 3rd">More info</button>
                </div>
              </article>

              {/* Card 3 */}
              <article id="card-2-1067" className="card" aria-labelledby="card-3-title">
                <div className="copy" role="group" aria-labelledby="card-3-title">
                  <h2 id="card-3-title" className="t-title typo-7">Form from November 3rd</h2>
                  <div className="t-section-1 typo-8">Progress</div>
                  <p className="t-text-1 typo-5">I advanced in my assingment</p>
                  <div className="t-section-2 typo-8">Blockers</div>
                  <p className="t-text-2 typo-5">There is a big issue with the platform</p>
                  <div className="t-section-3 typo-8">Resolutions</div>
                  <p className="t-text-3 typo-5">I fixed 3 bugs</p>
                </div>
                <div className="btn btn-style-4">
                  <button className="text typo-6" type="button" aria-label="More info about Form from November 3rd">More info</button>
                </div>
              </article>

              {/* Card 4 */}
              <article id="card-2-1079" className="card" aria-labelledby="card-4-title">
                <div className="copy" role="group" aria-labelledby="card-4-title">
                  <h2 id="card-4-title" className="t-title typo-7">Form from November 3rd</h2>
                  <div className="t-section-1 typo-8">Progress</div>
                  <p className="t-text-1 typo-5">I advanced in my assingment</p>
                  <div className="t-section-2 typo-8">Blockers</div>
                  <p className="t-text-2 typo-5">There is a big issue with the platform</p>
                  <div className="t-section-3 typo-8">Resolutions</div>
                  <p className="t-text-3 typo-5">I fixed 3 bugs</p>
                </div>
                <div className="btn btn-style-4">
                  <button className="text typo-6" type="button" aria-label="More info about Form from November 3rd">More info</button>
                </div>
              </article>

              {/* Card 5 */}
              <article id="card-2-1091" className="card" aria-labelledby="card-5-title">
                <div className="copy" role="group" aria-labelledby="card-5-title">
                  <h2 id="card-5-title" className="t-title typo-7">Form from November 3rd</h2>
                  <div className="t-section-1 typo-8">Progress</div>
                  <p className="t-text-1 typo-5">I advanced in my assingment</p>
                  <div className="t-section-2 typo-8">Blockers</div>
                  <p className="t-text-2 typo-5">There is a big issue with the platform</p>
                  <div className="t-section-3 typo-8">Resolutions</div>
                  <p className="t-text-3 typo-5">I fixed 3 bugs</p>
                </div>
                <div className="btn btn-style-4">
                  <button className="text typo-6" type="button" aria-label="More info about Form from November 3rd">More info</button>
                </div>
              </article>

              {/* Card 6 */}
              <article id="card-2-1103" className="card" aria-labelledby="card-6-title">
                <div className="copy" role="group" aria-labelledby="card-6-title">
                  <h2 id="card-6-title" className="t-title typo-7">Form from November 3rd</h2>
                  <div className="t-section-1 typo-8">Progress</div>
                  <p className="t-text-1 typo-5">I advanced in my assingment</p>
                  <div className="t-section-2 typo-8">Blockers</div>
                  <p className="t-text-2 typo-5">There is a big issue with the platform</p>
                  <div className="t-section-3 typo-8">Resolutions</div>
                  <p className="t-text-3 typo-5">I fixed 3 bugs</p>
                </div>
                <div className="btn btn-style-4">
                  <button className="text typo-6" type="button" aria-label="More info about Form from November 3rd">More info</button>
                </div>
              </article>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormHistory;
