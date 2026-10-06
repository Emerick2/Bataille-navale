# Démarrage
> Ici, vous allez voir comment démarrer le projet sur votre ordinateur.

### 1. Le serveur backend, l'API
Commencer par vous déplacer vers le dossier du serveur :

```bash
cd bataille/game-server
```

Maintenant que vous êtes dans ce dossier, utilisez la commande suivante pour ouvrir l'API :

```bash
deno task dev
```

Le serveur écoute par défaut sur `http://localhost:8000`. Sa documentation interactive est disponible sur `http://localhost:8000/docs`.

### 2. Le frontend
Cette fois-ci, il vous faudra tout d'abord aller dans le dossier contenant le frontend, il se trouve dans le dossier `bataille`.
Vous pouvez y aller en faisant :
```bash
cd bataille
```

S'il s'agit de votre premier démarrage, vous devrez tout d'abord télécharger les dépendances. Pour cela, faites :
```bash
npm install
```

Maintenant que vous êtes dans le bon dossier avec toutes les dépendances, démarrez le projet avec :
```bash
npm run dev
```

L'application est alors accessible à l'adresse affichée dans le terminal (généralement `http://localhost:5173`).

> Les deux serveurs doivent tourner en même temps pour que l'inscription et la connexion fonctionnent.

> Si vous rencontrez une erreur, partagez-la nous dans une issue pour que nous puissions la corriger, bonne partie !











