# Repository Guidelines

## Project Structure & Module Organization
MaxReward is a Vite + React SPA. Entry point flows from `src/main.jsx` into `src/App.jsx`. Feature-level screens live in `src/pages/{admin,member,merchant}` while navigational wiring sits in `src/routes`. Shared UI and primitives are grouped under `src/components` (common, layouts, ui, table, etc.), stateful logic under `src/redux` (`store.js`, `features`, `api`). Domain helpers are in `src/lib`, `src/utils`, and constants/env-safe config in `src/config` and `src/constant`. Static assets belong in `src/assets`, and any file served verbatim should go in `public/`. Production builds land in `dist/`.

## Build, Test, and Development Commands
`npm run dev` boots Vite with fast refresh on `http://localhost:5173` and loads vars from `.env`. `npm run build` outputs the optimized bundle to `dist/` (check this before tagging). `npm run preview` serves the built assets locally--use it to catch routing issues that dev mode hides. `npm run lint` runs ESLint 9 with the React Hooks/Refresh plugins; the CI mirrors this config, so lint must pass pre-push.

## Coding Style & Naming Conventions
Write modern ES modules with functional React components. Use PascalCase for components/files, camelCase for hooks/utilities, and SCREAMING_SNAKE_CASE for exported constants. Follow the existing two-space indentation, keep imports sorted from external -> absolute (`src/...`) -> relative, and favor Tailwind utility classes over bespoke CSS. ESLint enforces `no-unused-vars` (uppercase globals only exempt), so purge dead exports. Co-locate component-specific helpers next to the component instead of creating deep nesting.

## Testing Guidelines
No automated suite ships yet; add Vitest + React Testing Library when your change touches business logic. Name files `ComponentName.test.jsx` or `featureName.spec.js` beside the source, and verify Redux slices/selectors (`src/redux/features`) with deterministic cases. Run `npm run preview` for manual smoke tests and document test evidence in the PR until an automated workflow exists.

## Commit & Pull Request Guidelines
Commits should stay short, present tense, and imperative (e.g., `fix denomination`, `add payment proof note`). Reference issue IDs when relevant (`add payout proof #142`). PRs must describe scope, highlight UI changes with screenshots, note any schema/API updates, and list the commands used for validation. Keep branches focused (`feature/reward-stats-chart`), rebase onto `main` before requesting review, and ensure lint/build run clean locally.

## Security & Configuration Tips
Copy `.env.example` to `.env` and keep secrets out of git; only expose client-safe variables prefixed with `VITE_`. Double-check `src/redux/api` and `vercel.json` when modifying endpoints to avoid leaking prod URLs. When in doubt, guard new requests with centralized helpers in `src/utils` so headers (tokens, tenants) stay consistent.
