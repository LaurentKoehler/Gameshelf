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
- **Vite + React + TypeScript**
- **Tailwind CSS + DaisyUI** for styling
- **Recharts** for the stats page charts
- **localStorage** for persistence (no backend in v1)
- External API: **RAWG** (https://api.rawg.io/api)

## Hard rules
- TypeScript with simple, readable types (interfaces, unions, basic generics only — no type gymnastics). Explain any non-obvious TS concept in French in your chat response.
- No Redux/Zustand, no backend, no CSS-in-JS.
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
- API calls grouped in `src/api/rawg.ts`.
- localStorage logic grouped in `src/hooks/useLibrary.ts`.

## Testing
- Test framework: Vitest + React Testing Library (jsdom environment).
- Test behavior and logic, not implementation details: the `useLibrary` hook, `src/api/rawg.js` (with a mocked fetch), filtering/sorting logic.
- Acceptance criteria in SPEC.md (Given/When/Then) are the reference for what to test.
- From step 3 onwards, every step includes tests for the logic it introduces.
- All tests must pass before proposing a commit. Command: `npm test`.
- CI: a GitHub Actions workflow runs the tests on every push and pull request.

## Git
- Small, frequent commits: one per feature or fix.
- Commit messages in English, conventional format: `feat: add game search`, `fix: ...`, `style: ...`, `docs: ...`, `chore: ...`, `test: ...`.
- Never commit `node_modules` or `.env`.
- One branch per spec step, created from an up-to-date `main`, named `feat/<short-name>` (or `chore/<short-name>` for technical steps).
- Never commit feature work directly on `main`: it is merged through a GitHub pull request.
- After a PR is merged, switch back to `main` and pull before starting the next step.

## Commands
- `npm run dev` — development server
- `npm test` — run the test suite
- `npm run build` — production build

## Workflow
- Follow SPEC.md step by step. Never implement several steps at once.
- At the start of each step: create the feature branch.
- At the end of each step: make sure the app runs and all tests pass, commit, push the branch, and give me a suggested PR title and description.
