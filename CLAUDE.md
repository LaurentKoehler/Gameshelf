# GameShelf — Conventions du projet

## Le projet en une phrase
Application web de gestion de backlog de jeux vidéo : rechercher des jeux via l'API RAWG, les ajouter à sa bibliothèque avec un statut, les noter, et visualiser des statistiques sur sa collection.

## Contexte important
Le propriétaire du projet est un développeur junior en formation (React en cours d'apprentissage : props, state, hooks de base). Ce projet est un projet portfolio construit en collaboration avec Claude Code. Conséquences :
- Écris du code **simple et lisible** plutôt que malin ou ultra-optimisé.
- Privilégie les patterns React standards et modernes (composants fonctionnels + hooks).
- Ajoute des commentaires en français sur les parties non triviales (fetch, debounce, localStorage).
- Quand tu introduis un concept nouveau (custom hook, useEffect complexe), explique-le brièvement dans ta réponse.

## Stack technique (ne pas en dévier sans demander)
- **Vite + React** (JavaScript, PAS TypeScript)
- **Tailwind CSS + DaisyUI** pour le style
- **Recharts** pour les graphiques de la page stats
- **localStorage** pour la persistance (pas de backend en v1)
- API externe : **RAWG** (https://api.rawg.io/api)

## Interdits
- Pas de TypeScript, pas de Redux/Zustand, pas de backend, pas de CSS-in-JS.
- Pas de dépendance supplémentaire sans justification explicite.
- Ne jamais commiter le fichier `.env` (il contient la clé API RAWG).

## API RAWG
- La clé est dans `.env` : `VITE_RAWG_API_KEY` (accès via `import.meta.env.VITE_RAWG_API_KEY`).
- `.env` est dans le `.gitignore` ; fournir un `.env.example` avec une valeur factice.
- Toute page affichant des données RAWG doit contenir la mention « Data by RAWG » avec un lien vers https://rawg.io (obligation de la licence gratuite).
- Gérer proprement les états de chargement et d'erreur sur chaque appel API.

## Structure du code
- Composants dans `src/components/`, un composant par fichier.
- Les appels API regroupés dans `src/api/rawg.js`.
- La logique localStorage regroupée dans `src/hooks/useLibrary.js`.
- Interface utilisateur en français.

## Git
- Commits petits et fréquents, un par fonctionnalité ou correction.
- Messages de commit en anglais, format conventionnel : `feat: add game search`, `fix: ...`, `style: ...`, `docs: ...`.
- Ne jamais commiter `node_modules` ni `.env`.

## Commandes
- `npm run dev` — serveur de développement
- `npm run build` — build de production

## Méthode de travail
- Suivre SPEC.md étape par étape. Ne pas implémenter plusieurs étapes d'un coup.
- À la fin de chaque étape : vérifier que l'app tourne, puis proposer un commit.
