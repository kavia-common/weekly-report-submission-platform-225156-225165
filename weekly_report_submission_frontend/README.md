# Weekly Report Submission Frontend (React + Tailwind + Supabase)

A single-page app to submit weekly reports to a Supabase table, styled with the Champagne theme.

## Features

- Tailwind CSS with Champagne theme (primary #D97706, background #FFFBEB)
- Accessible, elegant single-page form
- Client-side validation
- Supabase integration via environment variables
- Success/error toast feedback

## Quick Start

1. Install dependencies:
   npm install

2. Configure environment:
   - Copy .env.example to .env
   - Set:
     REACT_APP_SUPABASE_URL=<your-supabase-url>
     REACT_APP_SUPABASE_KEY=<your-anon-public-key>

   Note: Do not commit actual .env values.

3. Start the app:
   npm start

4. Open http://localhost:3000

## Supabase Table (Schema)

Create table weekly_reports with columns:
- id: uuid (default uuid_generate_v4() or Supabase default)
- author_name: text
- progress: text
- blockers: text
- resolutions: text
- help_needed: text
- key_learnings: text
- next_week_plan: text
- created_at: timestamp with time zone (default now())

## Development Notes

- Tailwind is configured via tailwind.config.js and postcss.config.js
- Base styles are in src/index.css using Tailwind utilities
- Supabase client: src/lib/supabaseClient.js
- Service: src/services/reports.js
- Validation: src/utils/validation.js
- UI components under src/components

## Security

- No secrets are hardcoded.
- Supabase credentials must be provided via env vars:
  REACT_APP_SUPABASE_URL, REACT_APP_SUPABASE_KEY
- Logger avoids logging sensitive info.

## Build

- Build for production:
  npm run build

- Tests (if added):
  npm test
