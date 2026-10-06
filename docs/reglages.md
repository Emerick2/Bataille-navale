# Réglages de Bataille Navale

Ce document liste les réglages du jeu. Ce sont des constantes définies dans le code source : pour en changer la valeur, modifier le fichier indiqué, puis relancer le frontend (`npm run dev`).

| Réglage | Fichier | Valeur par défaut | Valeurs acceptées | Rôle |
|---|---|---|---|---|
| `height` | `bataille/src/GameGrid.tsx` | `10` | Nombre entier entre 2 et 20 | Taille de la grille de jeu, en nombre de cases par côté. |
| `numberOfBoat` | `bataille/src/GameGrid.tsx` | `9` | Nombre entier entre 2 et la valeur de `height` | Nombre de segments de bateau placés dans une partie. |