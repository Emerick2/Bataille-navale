# Fiche de lecture critique d'un guide technique


Document analysé : docs/README-#001.md (anciennement nommé README.md)
Rédaction : Émerick — Relecture : Paul-Elie


> Vous ne jugez pas le contenu technique du document : vous jugez sa structure
> et sa capacité à rendre un lecteur autonome.


| # | Critère | Constat | Renvoi (section ou page) |
|---|---|---|---|
| 1 | Objectif annoncé dès l'ouverture | L'objectif et la description du projet sont bien annoncés dès le début du document. | Linge 3-7 |
| 2 | Prérequis explicites | Les prérequis (Node.js, Deno) sont explicitement précisés. | Ligne 20-21 |
| 3 | Contexte et périmètre | Le contexte, l'équipe, l'encadrement scolaire et les technologies utilisées sont définis. | Ligne 3-16, Ligne 123-130 |
| 4 | Étapes numérotées et vérifiables | Les étapes pour ouvrir le projet sont numérotées et une image permet de vérifier que le résultat observé est celui attendu. | Ligne 23-62 |
| 5 | Encadrés typés (définition, avertissement, vérification) | Des blocs de citation sont utilisés pour encadrer des informations importantes, des avertissements et des notes de vérification. | Lignes 58-65 |
| 6 | Liste de contrôle finale | Une image et des indications textuelles sont présentes pour le contrôle final du lancement, bien qu'il n'y ait pas de liste exhaustive. | Ligne 65 |
| 7 | Lexique et sources datées | Un tableau récapitulatif des routes et des pages de l'application est présent, mais il n'y a pas de sources datées. | Ligne 68-79 |


## Le test décisif


Une personne qui n'a jamais vu ce projet peut-elle suivre ce document seule,
jusqu'au bout, sans poser de question ?


Réponse argumentée :
Oui, une personne qui n'a jamais vu ce projet peut suivre ce document seule jusqu'au bout, sans poser de question à une personne qui le connait déjà. En effet, l'installation et le lancement du projet sont détaillés étape par étape, tout comme les outils à télécharger pour pouvoir lancer le projet sans problème. De plus, les utilisateurs pourront constater qu'ils n'ont pas de problème grâce à des illustrations qui montrent ce à quoi doit ressembler le projet une fois correctement lancé.
Un utilisateur qui ne connaît pas le projet pourra également modifier très facilement certains paramètres en fonction de ses besoins puisqu'ils sont expliqués dans le README.


## Ce que je corrige dans notre propre documentation


C'est la section qui compte. Deux corrections concrètes, applicables aujourd'hui.


1. Liste de contrôle finale — Donner plus de détails pour permettre à l'utilisateur de savoir ce qui doit apparaître dans le terminal après les commandes pour lancer le projet, README.md, le lecteur doit pouvoir vérifier étape par étape que son logiciel est bien lancé sans erreur.


2. Sources datées — Ajouter des dates horodatées à chaque section utile, READEM.md, le lecteur doit pouvoir savoir à quelles dates les informations ont été écrites. Cela facilitera aussi pour les auteurs du README le fait de savoir qu'il faut vérifier que les données sont toujours d'actualité, puisqu'ils se rendront plus facilement compte qu'un fichier n'est plus à jour.


Correction déjà appliquée dans le dépôt :
- Des dates horodatées ont été ajoutées sous tous les titres de sections qui en avaient l'utilité dans le README. Cela permettra ainsi de mieux se repérer dans le temps et de voir plus facilement ce qui doit être mis à jour.
- Une liste de contrôle finale a été ajoutée, l'utilisateur pourra ainsi plus facilement voir où est le problème s'il y en a un. L'utilisateur pourra aussi s'assurer du bon fonctionnement de son outil.
