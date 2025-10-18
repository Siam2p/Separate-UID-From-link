# React + Vite — Minimal template

This repository demonstrates a compact React starter using Vite, focused on fast feedback during development and a small, configurable toolchain.

Purpose
- Quick start for React apps with Vite and Hot Module Replacement (HMR).
- Minimal ESLint setup included; extendable for production.

Key features
- Fast HMR via Vite for iterative development.
- Two official plugin options for React fast refresh:
  - @vitejs/plugin-react — Babel-based (or oxc with rolldown-vite).
  - @vitejs/plugin-react-swc — SWC-based, faster builds in many cases.

Notes
- React Compiler is deliberately not enabled here to avoid dev/build overhead. To enable, see the React Compiler docs: https://react.dev/learn/react-compiler/installation
- For production projects, prefer TypeScript and type-aware linting. See the TypeScript template and typescript-eslint for integration guidance.

# profile-link-to-id

This repository contains a small React application (Vite + TailwindCSS) that extracts Facebook user IDs (UIDs) from a list of profile links.

This README contains a per-file analysis, run instructions, and small suggestions for improvements.

## Quick start

Requirements:
- Node.js 18+ (recommended)
- npm (or yarn/pnpm)

Install and run in development:

```powershell
npm install
npm run dev
```

Build for production:

```powershell
npm run build
npm run preview
```

Linting:

```powershell
npm run lint
```

## What this app does

The app provides a single UI to paste multiple Facebook profile links (one per line). It parses each link and extracts either the username (path segment) or the numeric id (from profile.php?id=...). Extracted UIDs can be copied to clipboard.

## File-by-file analysis

- `package.json` — project manifest and scripts. Uses Vite, React 19, TailwindCSS and the `@tailwindcss/vite` plugin. Contains dev dependencies for ESLint and React types.

- `vite.config.js` — Vite configuration enabling the React plugin and the TailwindCSS plugin.

- `index.html` — App entry HTML which mounts the React app into `#root` and loads `/src/main.jsx`.

- `eslint.config.js` — ESLint configuration using `@eslint/js`, React Hooks recommended rules and `eslint-plugin-react-refresh` for Vite HMR compatibility. It ignores `dist` and sets a rule to ignore unused variables if they match `^[A-Z_]`.

- `src/main.jsx` — React bootstrap file. It imports `index.css` and renders `<App />` inside `StrictMode`.

- `src/index.css` — Imports Tailwind and sets a custom default font stack and body background. It also hides scrollbars using webkit selectors.

- `src/App.jsx` — Minimal app that renders the main component `LickToID` (note: component name is `LickToID` — likely a small typo and may have been intended to be `LinkToID`).

- `src/components/LickToID.jsx` — Main UI and logic. Key points:
  - Uses React hooks: `useState`, `useRef`, `useEffect`.
  - `links` state holds the textarea input; `uids` is an array of extracted ids; `uidBox` toggles the result display.
  - `lineCounter()` generates line numbers next to the textarea.
  - `SeparateUID()` runs on form submit. It:
    - reads the multiline `links` input,
    - splits and trims lines,
    - for each line, it attempts to construct a `URL` and extracts either the first pathname segment or the `id` query param when the pathname is `profile.php`,
    - handles invalid URLs and falls back to 'Invalid URL' or 'No UID found'.
  - `copyToClipboard()` writes the joined UIDs to the clipboard and alerts on success.
  - Has scroll syncing logic between the line-number column and the textarea using direct DOM event listeners.

- `public/vite.svg` and `src/assets/react.svg` — static assets used for branding/icons.

## Notable details and small issues found

- Component name `LickToID` appears in `src/components/LickToID.jsx` and is imported in `src/App.jsx`. If the intended name is `LinkToID`, consider renaming files and symbols for clarity.

- The app uses `alert()` for copy success. For a better UX, prefer a non-blocking toast notification.

- `index.css` references "Facebook Sans" in the font stack. This font may not be available by default — consider adding a fallback or bundling a webfont.

- The line number scroll sync uses DOM event listeners on mount/unmount. That works but could be made more robust using refs and CSS overlays. Keep the current approach if it meets your needs.

- Error handling: `SeparateUID` catches URL parsing errors and returns 'Invalid URL'. Consider validating input earlier and trimming whitespace to reduce parsing errors.

- Accessibility: the textarea does not have an associated visible label for screen readers beyond the wrapping text; ensure `aria-label` or `id`+`label` association if accessibility is a goal.

## Suggested small improvements (low-risk)

- Rename component and file to `LinkToID.jsx` if that was intended (search & replace import in `App.jsx`).
- Replace `alert()` with a small toast/snackbar (e.g., Tailwind + small state) to avoid blocking behavior.
- Add a small unit test for `SeparateUID` logic (extract function) to ensure edge cases (profile.php?id=, usernames with slashes, invalid URLs) are covered.

## Next steps I can take (if you want)

- Run `npm install` and `npm run dev` to verify the app starts locally (I will run commands in the terminal if you want me to).
- Implement the rename from `LickToID` to `LinkToID` and update imports.
- Add a small test file and run tests (requires adding a test runner like Vitest).

## Completion summary

I updated this `README.md` with a per-file analysis, run instructions, notable observations, and suggested improvements.

If you want, I can now: rename the component, add a non-blocking notification for copy success, or run and verify the app locally. Tell me which you'd like next.
