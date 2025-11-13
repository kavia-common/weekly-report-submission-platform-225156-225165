# weekly-report-submission-platform-225156-225165

This workspace contains the Weekly Report Submission frontend (React + Tailwind) that posts to a Supabase table.

- App location: weekly_report_submission_frontend/
- Start locally: npm install && npm start (inside the frontend folder)
- Configure Supabase via .env in the frontend folder.
- The weekly_reports table uses the new schema: author_name, week_start, week_end, progress, blockers, resolutions, help_needed, key_learnings, next_week_plan, created_at.