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

---

## User stories

### US-1 — Search for a game
As a user, I want to search for any game by its name so that I can find it and add it to my library.

Acceptance criteria:
- Given I am on any page, when I type at least 2 characters in the search bar, then a dropdown shows up to 8 matching games with cover, title, release year, and platforms.
- Given a search is in progress, when results have not arrived yet, then a loading indicator is visible.
- Given my search matches no game, when the response arrives, then the dropdown shows a "no results" message.
- Given the RAWG API is unreachable, when the request fails, then a clear error message is shown (no crash, no silent failure).
- Given the dropdown is open, when I click outside of it or press Escape, then it closes.

Business rules:
- Requests are debounced (~400 ms) to avoid one API call per keystroke.
- Search queries the RAWG endpoint `GET /games?search=...&page_size=8`.

### US-2 — Add a game to the library
As a user, I want to add a game from the search results with a status so that it enters my backlog.

Acceptance criteria:
- Given search results are displayed, when I click a result, then a detail modal opens with the game info, a status picker, and an "Ajouter" button.
- Given the detail modal is open, when I confirm with a chosen status, then the game is saved to my library and a visual confirmation is shown.
- Given a game is already in my library, when I open its detail modal from search, then the modal shows "Déjà dans la bibliothèque" instead of the add button.

Business rules:
- A game can only exist once in the library (RAWG id is the unique key).
- Default status if none is picked: "backlog" (À faire).
- The library persists between sessions (localStorage).

### US-3 — View my library
As a user, I want to see all the games in my library so that I can get an overview of my backlog.

Acceptance criteria:
- Given my library contains games, when I open the library page, then each game appears as a card with cover, title, colored status badge, and personal rating (if any).
- Given my library is empty, when I open the library page, then a friendly empty state invites me to search for a first game.

### US-4 — Update a game
As a user, I want to change a game's status, rate it, or remove it so that my library reflects reality.

Acceptance criteria:
- Given a game card, when I pick another status, then the card updates immediately and the change is persisted.
- Given a game card, when I set a rating from 1 to 10, then the rating is displayed and persisted.
- Given a game card, when I click delete, then a confirmation is required before the game is removed.
- Given a game, when its status becomes "finished", then `finishedAt` is set to the current date automatically.

Business rules:
- Rating is optional and independent from the status.
- Deleting a game removes it and its rating permanently (no archive in v1).

### US-5 — Filter and sort the library
As a user, I want to filter and sort my games so that I can find what to play next.

Acceptance criteria:
- Given my library is displayed, when I click a status filter (Tous / Wishlist / À faire / En cours / Terminés / Abandonnés), then only matching games are shown and each filter shows its count.
- Given my library is displayed, when I pick a sort option (date added, alphabetical, personal rating, Metacritic), then the cards reorder accordingly.
- Given genres exist in my library, when I pick a genre filter, then only games of that genre are shown.
- Given active filters produce no game, when the list is empty, then an explicit "no games match" state is shown.

Business rules:
- Filters and sorting combine (e.g. "En cours" + sorted by Metacritic).
- The genre list is derived from the games actually present in the library.

### US-6 — View my stats
As a user, I want statistics about my collection so that I can see my gaming habits at a glance.

Acceptance criteria:
- Given my library contains games, when I open the stats page, then I see: total games, games finished this year, games currently playing, and my average rating.
- Given games were finished in the last 12 months, when I view the stats page, then a bar chart shows finished games per month.
- Given my games have genres, when I view the stats page, then a donut chart shows the distribution by genre.
- Given my library is empty, when I open the stats page, then an empty state explains that stats will appear once games are added.

---

## Steps (one branch + one PR each, one at a time)

### Step 1 — Foundations — DONE
Git init, Vite + React, Tailwind + DaisyUI, base layout (header with search placeholder, content area, footer with "Data by RAWG" linking to rawg.io), dark theme, `.gitignore`, `.env.example`, minimal README.

### Step 2 — RAWG search (US-1, US-2)
Search bar with debounce, results dropdown, loading/empty/error states, game detail modal, add to library with status.

### Step 2b — Testing setup and CI
- Install and configure Vitest + React Testing Library (jsdom environment), add an `npm test` script.
- First tests: one smoke test (the app renders the header) and unit tests for `src/api/rawg.js` with a mocked fetch (US-1 error and no-result cases).
- Add a GitHub Actions workflow (`.github/workflows/ci.yml`) that installs dependencies and runs the tests on every push and pull request.

### Step 3 — Library and persistence (US-2, US-3)
`useLibrary` custom hook (localStorage), `GameCard` grid, duplicate prevention, empty state. Tests: `useLibrary` add/duplicate/persistence logic.

### Step 4 — Managing a game (US-4)
Status change, rating 1-10, delete with confirmation, automatic `finishedAt`. Tests: update/delete/finishedAt logic in `useLibrary`.

### Step 5 — Filters and sorting (US-5)
Status filter bar with counters, sort options, genre filter, combined filters, empty-filter state. Tests: filtering and sorting functions.

### Step 6 — Stats page (US-6)
Counters, bar chart (finished per month), donut chart (genres), navigation between "Bibliothèque" and "Stats". Tests: stats computation functions.

### Step 7 — Polish
Mobile responsiveness, confirmation toasts, accessibility pass (labels, alt, contrast, keyboard navigation on search), full README in English (description, screenshots, stack, setup, "How this project was built with Claude Code" section, known limitation: API key visible client-side, planned v2 fix: backend proxy).

### Step 8 — Deployment
Production build, deploy to Vercel or Netlify (environment variable for the key), live demo link in README and repo description.

---

## Out of scope for v1 (do not implement)
- Backend, user accounts, authentication.
- Automatic import from Steam or other platforms.
- Multiplayer / library sharing.
