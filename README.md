# GameShelf

A web app to manage a video game backlog: search games through the RAWG API, add them to a personal library with a status, rate them, and visualize statistics about the collection.

## Stack

- Vite + React + TypeScript
- Tailwind CSS + DaisyUI
- Recharts (coming soon)
- localStorage for persistence
- [RAWG](https://rawg.io) API

## Setup

```bash
npm install
cp .env.example .env
# then set VITE_RAWG_API_KEY in .env
npm run dev
```

## Commands

- `npm run dev` — development server
- `npm run build` — production build
