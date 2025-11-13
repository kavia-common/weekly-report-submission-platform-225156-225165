#!/bin/bash
cd /home/kavia/workspace/code-generation/weekly-report-submission-platform-225156-225165/weekly_report_submission_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

