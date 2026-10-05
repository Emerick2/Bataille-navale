# Bataille Navale
> Jeu de bataille navale au tour par tour en asyncrone, réalisé en **React** et **TypeScript** dans le cadre d'un projet de groupe.
> Ce jeu vous permet de vous créer un compte, de lancer une partie contre quelqu'un et de revenir jouer contre cette personne.

## Technologies utilisées

- **React** : construction de l'interface
- **TypeScript** : JavaScript typé
- **Vite** : serveur de développement et build
- **React Router** : navigation entre les pages
- **CSS Modules** : styles isolés par composant
- **Deno** et **SQLite** : serveur backend (fourni séparément)

## Prérequis

- [Node.js](https://nodejs.org/) et npm
- [Deno](https://deno.com/) 2.9 ou plus, pour lancer le serveur backend

## Installation et démarrage

### 1. Le serveur backend

Dans le dossier du serveur, lancer :

```bash
deno task dev
```

Le serveur écoute par défaut sur `http://localhost:8000`. Sa documentation interactive est disponible sur `http://localhost:8000/docs`.

### 2. Le frontend

Le projet React se trouve dans le dossier `bataille/`. Dans un **second terminal** :

```bash
cd bataille
npm install
npm run dev
```

L'application est alors accessible à l'adresse affichée dans le terminal (généralement `http://localhost:5173`).

> Les deux serveurs doivent tourner en même temps pour que l'inscription et la connexion fonctionnent.

## Pages de l'application

| Route | Page |
| --- | --- |
| `/` | Accueil |
| `/inscription` | Création de compte |
| `/connexion` | Connexion |
| `/parties` | Mes parties |
| `/parties/nouvelle` | Nouvelle partie |
| `/parties/:id` | Une partie |
| `/historique` | Historique des parties |
| `/credits` | Crédits |

## Authentification

L'inscription (`POST /auth/signup`) et la connexion (`POST /auth/login`) prennent un **email** et un **mot de passe**. Le serveur renvoie un **token**, nécessaire pour appeler les autres routes de l'API. L'inscription connecte automatiquement l'utilisateur.

## Architecture

```
Bataille-navale/
└── bataille/
    └── src/
        ├── Layouts/     # Mise en page commune (navbar)
        ├── pages/       # Une page par dossier (Home, Login, Register, ...)
        ├── App.tsx      # Déclaration des routes
        └── index.css    # Variables de thème partagées (couleurs, police)
```

Chaque page a son propre fichier `NomDeLaPage.module.css`. Les couleurs et la police viennent des variables définies dans `index.css` (`var(--texte)`, `var(--sonar)`, etc.) pour garder un rendu cohérent.



## Contribuer
Toute modification de ce projet passe par une Pull Request dédiée à une issue (un groupe d'issues) en particulier. Si vous voyez un problème ou un ajout à réaliser sur ce projet, il vous faudra donc faire une issue décrite en quatre étapes. Créer une branche qui sera dédiée à la résolution de cette issue puis faire une Pull Request en y assignant un autre membre du groupe. Celui-ci relira votre travail et pourra ainsi valider ou non son ajout dans le projet.
Les commandes d'installation des dépendances du projet sont décrites ci-dessus.


## Contact
- [Emerick Pacaud](https://github.com/Emerick2) | pacaudemerick@gmail.com
- [Armel Zion](https://github.com/Armel-zion)
- [Paul-Elie Kouakou](https://github.com/pauloo10-ynov)


