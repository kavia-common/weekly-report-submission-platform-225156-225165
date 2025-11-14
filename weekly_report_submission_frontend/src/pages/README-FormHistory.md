# Form History Page

- Path: /history
- Component: src/pages/FormHistory.jsx
- Purpose: Integrates the static "Form history" screen from assets.
- Styling:
  - Imports assets/common.css and assets/form-history-1-534.css.
  - Wrapped inside a Tailwind container with Champagne theme gradient backdrop.
  - A wrapper class `form-history-wrapper` scopes the imported styles to minimize conflicts.
- Navigation:
  - Header now includes Home (/), Submit (/submit), and History (/history) links.
- Notes:
  - Assets are referenced via relative imports; no images required by the provided design.
  - Do not edit asset files; modify component CSS or Tailwind utilities if adjustments are needed.
