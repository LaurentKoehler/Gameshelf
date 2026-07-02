# GameShelf — Spécification fonctionnelle

## Vision
Tous les joueurs ont une « pile de honte » : jeux achetés jamais lancés, jeux commencés jamais finis. GameShelf permet de reprendre le contrôle : chercher n'importe quel jeu, l'ajouter à sa bibliothèque avec un statut, le noter, et visualiser des statistiques sur sa collection.

## Modèle de données
Un jeu dans la bibliothèque (stocké en localStorage sous la clé `gameshelf-library`) :

```js
{
  id: 3498,                    // id RAWG
  title: "Elden Ring",
  cover: "https://...",        // background_image RAWG
  released: "2022-02-25",
  genres: ["Action", "RPG"],   // noms des genres RAWG
  platforms: ["PC", "PS5"],    // noms des plateformes parentes
  metacritic: 96,              // peut être null
  status: "playing",           // "wishlist" | "backlog" | "playing" | "finished" | "dropped"
  rating: 9,                   // note perso 1-10, null si non noté
  addedAt: "2026-07-03",       // date d'ajout
  finishedAt: null             // date de passage à "finished", sinon null
}
```

Libellés français des statuts : Wishlist, À faire, En cours, Terminé, Abandonné.

## Étapes (une à la fois, commit à la fin de chacune)

### Étape 1 — Fondations
- Initialiser git, projet Vite + React, Tailwind + DaisyUI, structure de dossiers.
- Layout de base : header avec logo/titre « GameShelf » et emplacement de la barre de recherche, zone de contenu, footer avec « Data by RAWG » (lien vers rawg.io).
- Thème sombre DaisyUI par défaut.
- `.gitignore` (node_modules, .env), `.env.example`, README minimal.

### Étape 2 — Recherche RAWG
- Barre de recherche dans le header : à la saisie (debounce ~400 ms), appel à `GET /games?search=...&page_size=8`.
- Affichage des résultats en dropdown sous la barre : jaquette miniature, titre, année, plateformes.
- États : chargement (spinner), aucun résultat, erreur réseau.
- Clic sur un résultat → modale de la fiche jeu avec bouton « Ajouter » et choix du statut.

### Étape 3 — Bibliothèque et persistance
- Custom hook `useLibrary` : lecture/écriture localStorage, ajout, suppression, mise à jour d'un jeu.
- Grille de cartes `GameCard` : jaquette, titre, badge de statut coloré, note perso.
- Empêcher les doublons (un jeu déjà présent affiche « Déjà dans la bibliothèque »).
- État vide accueillant si la bibliothèque est vide (invitation à chercher un premier jeu).

### Étape 4 — Gestion d'un jeu
- Sur chaque carte : changer le statut (menu déroulant ou boutons), noter de 1 à 10, supprimer (avec confirmation).
- Passage à « Terminé » → enregistrer `finishedAt` automatiquement.

### Étape 5 — Filtres et tri
- Barre de filtres par statut (Tous / Wishlist / À faire / En cours / Terminés / Abandonnés) avec compteur par statut.
- Tri : date d'ajout, ordre alphabétique, note perso, note Metacritic.
- Filtre par genre (liste déduite des jeux présents).

### Étape 6 — Page statistiques
- Compteurs : total, terminés dans l'année, en cours, note moyenne.
- Graphique en barres : jeux terminés par mois (12 derniers mois).
- Graphique en camembert/donut : répartition par genre.
- Navigation simple entre « Bibliothèque » et « Stats » (React Router ou état local, au choix le plus simple).

### Étape 7 — Finitions
- Responsive mobile (la grille passe en 1-2 colonnes).
- Toasts de confirmation (ajout, suppression).
- Vérification accessibilité de base : labels, alt sur les images, contraste, navigation clavier sur la recherche.
- README complet : description, screenshots, stack, installation, section « Comment ce projet a été construit avec Claude Code », limite connue (clé API visible côté client) et solution prévue en v2 (proxy backend).

### Étape 8 — Déploiement
- Build de production, déploiement sur Vercel ou Netlify (variable d'environnement pour la clé).
- Ajout du lien de la démo dans le README et la description GitHub.

## Hors périmètre v1 (ne pas implémenter)
- Backend, comptes utilisateurs, authentification.
- Import automatique depuis Steam ou autres plateformes.
- Mode multijoueur / partage de bibliothèques.
