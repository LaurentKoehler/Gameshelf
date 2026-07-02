# GameShelf — Project conventions

## The project in one sentence
A web app to manage a video game backlog: search games through the RAWG API, add them to a personal library with a status, rate them, and visualize statistics about the collection.

## Important context
The project owner is a junior developer in training (currently learning React: props, state, basic hooks). His native language is French. This is a portfolio project built in collaboration with Claude Code. Consequences:
- Write code that is **simple and readable** rather than clever or over-optimized.
- Stick to standard, modern React patterns (functional components + hooks).
- Write code comments in English, but keep them beginner-friendly on non-trivial parts (fetch, debounce, localStorage).
- When you introduce a new concept (custom hook, complex useEffect), briefly explain it in French in your chat response.

## Tech stack (do not deviate without asking)
- **Vite + React** (JavaScript, NOT TypeScript)
- **Tailwind CSS + DaisyUI** for styling
- **Recharts** for the stats page charts
- **localStorage** for persistence (no backend in v1)
- External API: **RAWG** (https://api.rawg.io/api)

## Hard rules
- No TypeScript, no Redux/Zustand, no backend, no CSS-in-JS.
- No additional dependency without explicit justification.
- Never commit the `.env` file (it contains the RAWG API key).
- **All user-facing UI text is in French** (product choice). Everything else — code, comments, commits, docs — is in English.

## RAWG API
- The key lives in `.env` as `VITE_RAWG_API_KEY` (accessed via `import.meta.env.VITE_RAWG_API_KEY`).
- `.env` is gitignored; provide a `.env.example` with a placeholder value.
- Every page displaying RAWG data must show "Data by RAWG" with a link to https://rawg.io (free-tier license requirement).
- Handle loading and error states properly on every API call.

## Code structure
- Components in `src/components/`, one component per file.
- API calls grouped in `src/api/rawg.js`.
- localStorage logic grouped in `src/hooks/useLibrary.js`.

## Git
- Small, frequent commits: one per feature or fix.
- Commit messages in English, conventional format: `feat: add game search`, `fix: ...`, `style: ...`, `docs: ...`.
- Never commit `node_modules` or `.env`.

## Commands
- `npm run dev` — development server
- `npm run build` — production build

## Workflow
- Follow SPEC.md step by step. Never implement several steps at once.
- At the end of each step: check the app runs, then propose a commit.
