# TeamFlow — Employee Management Dashboard

A frontend portfolio project demonstrating a small employee directory built with React, TypeScript, Vite and CSS.

## Features

- Responsive dashboard layout with employee summary cards
- Employee directory populated from the public DummyJSON Users API
- Loading, error and empty states
- Search by name, email, department or job title
- Department and status filters
- Sortable table columns and pagination
- Add and edit employee forms with basic validation
- CSV export of the currently filtered results
- Unit tests for filtering, sorting and name formatting
- GitHub Actions workflows for CI checks and GitHub Pages deployment

## Tech stack

- React 18 and TypeScript
- Vite
- Lucide icons
- Vitest and Testing Library
- GitHub Actions / GitHub Pages

## Run locally

Requirements: Node.js 20 or later and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Test and build

```bash
npm test
npm run build
npm run preview
```

## Deploy to GitHub Pages

1. Create a new GitHub repository named `teamflow-employee-dashboard`.
2. Upload/push this project to the repository's `main` branch.
3. Open the repository's **Settings → Pages**.
4. Under **Build and deployment**, select **GitHub Actions** as the source.
5. Open the **Actions** tab and watch the **Deploy to GitHub Pages** workflow.
6. When it succeeds, open the deployment URL shown in the workflow summary or Settings → Pages.

## Data and demo limitations

- Employee data is fetched from DummyJSON, a public demo API. An internet connection is needed for the initial load.
- Add/edit changes live only in the current browser session and are not sent to a backend. Refreshing the page reloads the demo API data.
- The statuses and fallback department/title values are demo presentation data, not verified employment records.
- This project has no authentication.

## Next Improvements

- **Component tests.** Current tests cover filtering, sorting and name formatting. Next: React Testing Library tests for the employee form (validation messages) and for the loading, error and empty states.
- **Authentication and roles.** A real employee tool needs sign-in and permissions before it should handle any real data.
- **Persist changes.** Add/edit currently live only in the browser session. Next step: save them to `localStorage`, then to a small backend API.
- **Accessibility audit.** table semantics for sortable columns, keyboard navigation, focus management in the forms, and colour contrast.
