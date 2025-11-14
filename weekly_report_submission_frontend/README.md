# Weekly Report Submission Frontend (React + Tailwind + Supabase)

A single-page app to submit weekly reports to a Supabase table, styled with the Champagne theme.

## Features

- Tailwind CSS with Champagne theme (primary #D97706, background #FFFBEB)
- Accessible, elegant single-page form
- Client-side validation
- Supabase integration via environment variables
- Success/error toast feedback
- Email/Password authentication (Sign In + Register) and Google sign-in via Supabase Auth

## Quick Start

1. Install dependencies:
   npm install

2. Configure environment:
   - Copy .env.example to .env
   - Set:
     REACT_APP_SUPABASE_URL=<your-supabase-url>
     REACT_APP_SUPABASE_KEY=<your-anon-public-key>
     REACT_APP_FRONTEND_URL=<http://localhost:3000 or your deployed URL>  # Used for auth redirect

   Note: Do not commit actual .env values.

3. Start the app:
   npm start

4. Open http://localhost:3000

## Authentication

- Navigate to /login to sign in.
- Options:
  - Email/Password:
    - Sign In uses supabase.auth.signInWithPassword({ email, password })
    - Register uses supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${REACT_APP_FRONTEND_URL}/submit` } })
      - If your Supabase project requires email confirmation, the app shows a message to check your inbox.
  - Google:
    - Uses supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${REACT_APP_FRONTEND_URL}/submit` } })

- On success, you are redirected to /submit.

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
- Supabase client: src/utils/supabaseClient.js (uses REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY)
- Auth helpers: src/utils/auth.js
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
