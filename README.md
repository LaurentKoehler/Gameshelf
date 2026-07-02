# GameShelf

Application web de gestion de backlog de jeux vidéo : rechercher des jeux via l'API RAWG, les ajouter à sa bibliothèque avec un statut, les noter, et visualiser des statistiques sur sa collection.

## Stack

- Vite + React (JavaScript)
- Tailwind CSS + DaisyUI
- Recharts (à venir)
- localStorage pour la persistance
- API [RAWG](https://rawg.io)

## Installation

```bash
npm install
cp .env.example .env
# puis renseigner VITE_RAWG_API_KEY dans .env
npm run dev
```

## Commandes

- `npm run dev` — serveur de développement
- `npm run build` — build de production
