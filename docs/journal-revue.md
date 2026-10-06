# Journal de traitement des retours de revue

Équipe : Bataille Navale (Émerick Pacaud, Armel Zion, Paul-Elie Kouakou) — Relue par : relectures internes de la séance 3, et binôme bvanamor/TP-GITHUB ([issue #46](https://github.com/Emerick2/Bataille-navale/issues/46)) — Date : 6 octobre 2026

> Une ligne par retour reçu. Aucun retour ne reste sans ligne.
> Écarter un retour est permis : la raison s'écrit ici et à l'endroit du retour.

| Retour reçu | Portée | Décision | Trace |
|---|---|---|---|
| Formulation trop longue dans le démarrage du frontend : « Cette fois-ci, il vous faudra tout d'abord aller dans le dossier… » ([issue #46](https://github.com/Emerick2/Bataille-navale/issues/46), piste 1) | suggestion | Corrigé : la consigne tient en une phrase (« Dans un second terminal, depuis la racine du projet, accédez au dossier du frontend ») | Commit `8bcab9b` sur la branche `doc/corrections-revue` |
| Le tableau des pages n'indique pas lesquelles demandent d'être connecté ([issue #46](https://github.com/Emerick2/Bataille-navale/issues/46), piste 2) | suggestion | Retenu : colonne « Connexion requise » à ajouter au tableau | Réponse d'Émerick dans l'issue #46 |
| Aucune commande pour installer Deno n'est donnée ([issue #46](https://github.com/Emerick2/Bataille-navale/issues/46), piste 3) | suggestion | Corrigé : commandes d'installation pour Windows et macOS/Linux ajoutées aux prérequis, avec une vérification par `deno --version` | Commit `a7a53a3` sur la branche `doc/corrections-revue` |
| Doute sur l'usage de `sessionStorage` dans le schéma ([PR #50](https://github.com/Emerick2/Bataille-navale/pull/50), commentaire sur `bataille/docs/architecture.md` ligne 19) | question | Écarté : le texte est exact, vérifié dans `bataille/src/context/AuthContext.tsx` (`login()` enregistre la session avec `sessionStorage.setItem`, `restoreSession()` la relit au chargement) ; le relecteur l'a confirmé dans la discussion | Réponse écrite dans la PR #50, avec les fichiers et fonctions cités |
| Garder un email de contact dans la section Contact plutôt que les seules issues ([PR #41](https://github.com/Emerick2/Bataille-navale/pull/41), commentaire d'Émerick) | suggestion | Retenu : les emails sont conservés à côté du lien vers les issues (voir décision 2) | Commentaire d'Émerick dans la PR #41 |
| Le tableau de répartition doit indiquer que le schéma d'architecture est terminé ([PR #48](https://github.com/Emerick2/Bataille-navale/pull/48), commentaire d'Armel) | suggestion | Corrigé : tableau mis à jour | Commit `68490a0` « Mise à jours du tableau de répartition. » |

## Les deux décisions que nous justifierons à l'oral

### Décision 1 — Écarter le retour sur `sessionStorage`

- Contrainte : le schéma doit décrire le fonctionnement réel du code, pas une impression d'utilisation.
- Options envisagées : retirer la mention de `sessionStorage` du schéma, ou la conserver après vérification.
- Critère retenu : ce que fait le code (`AuthContext.tsx`), vérifiable par n'importe quel membre.
- Coût assumé : le comportement observé par le relecteur (déconnexion dans un nouvel onglet) n'est pas encore expliqué dans la documentation.

### Décision 2 — Conserver les emails dans la section Contact

- Contrainte : le dépôt est public ; la fiche du TP2 recommande l'onglet Issues plutôt qu'un courriel personnel.
- Options envisagées : seulement les issues, seulement les emails, ou les deux.
- Critère retenu : laisser à une personne extérieure un moyen de contact direct, en plus des issues.
- Coût assumé : les adresses sont visibles publiquement et peuvent être collectées par des robots ; à réévaluer si l'équipe reçoit du courrier indésirable.
