# GameShelf — Functional specification

## Vision
Every gamer has a "pile of shame": games bought but never launched, games started but never finished. GameShelf helps take back control: search any game, add it to a personal library with a status, rate it, and visualize statistics about the collection.

## Data model
A game in the library (stored in localStorage under the key `gameshelf-library`):

```js
{
  id: 3498,                    // RAWG id
  title: "Elden Ring",
  cover: "https://...",        // RAWG background_image
  released: "2022-02-25",
  genres: ["Action", "RPG"],   // RAWG genre names
  platforms: ["PC", "PS5"],    // parent platform names
  metacritic: 96,              // can be null
  status: "playing",           // "wishlist" | "backlog" | "playing" | "finished" | "dropped"
  rating: 9,                   // personal rating 1-10, null if unrated
  addedAt: "2026-07-03",       // date added
  finishedAt: null             // date the status became "finished", otherwise null
}
```

French labels for statuses (UI is in French): Wishlist, À faire, En cours, Terminé, Abandonné.

## Steps (one at a time, commit at the end of each)

### Step 1 — Foundations
- Initialize git, Vite + React project, Tailwind + DaisyUI, folder structure.
- Base layout: header with "GameShelf" logo/title and a placeholder for the search bar, content area, footer with "Data by RAWG" (link to rawg.io).
- DaisyUI dark theme by default.
- `.gitignore` (node_modules, .env), `.env.example`, minimal README.

### Step 2 — RAWG search
- Search bar in the header: on typing (debounce ~400 ms), call `GET /games?search=...&page_size=8`.
- Results shown in a dropdown under the bar: thumbnail cover, title, year, platforms.
- States: loading (spinner), no results, network error.
- Clicking a result → game detail modal with an "Ajouter" button and status picker.

### Step 3 — Library and persistence
- Custom hook `useLibrary`: localStorage read/write, add, remove, update a game.
- Grid of `GameCard` components: cover, title, colored status badge, personal rating.
- Prevent duplicates (an already-added game shows "Déjà dans la bibliothèque").
- Friendly empty state when the library is empty (invite to search for a first game).

### Step 4 — Managing a game
- On each card: change status (dropdown or buttons), rate 1-10, delete (with confirmation).
- Switching to "finished" → record `finishedAt` automatically.

### Step 5 — Filters and sorting
- Status filter bar (Tous / Wishlist / À faire / En cours / Terminés / Abandonnés) with a counter per status.
- Sorting: date added, alphabetical, personal rating, Metacritic score.
- Genre filter (list derived from the games present).

### Step 6 — Stats page
- Counters: total, finished this year, currently playing, average rating.
- Bar chart: games finished per month (last 12 months).
- Pie/donut chart: distribution by genre.
- Simple navigation between "Bibliothèque" and "Stats" (React Router or local state, whichever is simpler).

### Step 7 — Polish
- Mobile responsiveness (grid drops to 1-2 columns).
- Confirmation toasts (add, delete).
- Basic accessibility pass: labels, alt on images, contrast, keyboard navigation on search.
- Full README (in English): description, screenshots, stack, setup, a "How this project was built with Claude Code" section, known limitation (API key visible client-side) and the planned v2 fix (backend proxy).

### Step 8 — Deployment
- Production build, deploy to Vercel or Netlify (environment variable for the key).
- Add the live demo link to the README and the GitHub repo description.

## Out of scope for v1 (do not implement)
- Backend, user accounts, authentication.
- Automatic import from Steam or other platforms.
- Multiplayer / library sharing.
