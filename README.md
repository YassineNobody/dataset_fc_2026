# FC26 — API de données football

API REST en Node.js et TypeScript pour explorer un dataset de joueurs EA Sports FC 26. Le projet propose des filtres par club, championnat et nationalité, ainsi qu'un système de comptes utilisateurs avec authentification JWT.

## État du projet

Projet en cours de développement. La compilation et la recherche de joueurs présentent actuellement des problèmes connus, détaillés dans la section « À faire ». Ce dépôt contient uniquement le backend.

## Technologies

- Node.js, Express 5 et TypeScript
- PostgreSQL et Sequelize pour les comptes utilisateurs
- Argon2 pour le hachage des mots de passe
- JSON Web Tokens pour l'authentification
- express-validator pour la validation des formulaires

## Données et fonctionnalités

Les données football sont chargées en mémoire depuis `src/data/players.json` et `src/data/leagues.json`. Elles ne sont pas stockées dans PostgreSQL.

Le dataset inclus contient :

- 18 405 joueurs et 662 clubs ;
- 160 nationalités ;
- 51 ligues représentées parmi les joueurs, et 52 entrées dans le fichier des ligues ;
- une version FC 26 avec une date de mise à jour au 19 septembre 2025.

L'API permet de consulter les statistiques du dataset, de lister les clubs, ligues et nationalités, de filtrer les joueurs et de consulter les sélections nationales. Elle expose également une recherche de clubs et une recherche de joueurs, cette dernière restant à corriger.

L'authentification permet l'inscription, la connexion par email ou nom d'utilisateur, et la consultation du profil associé à un JWT.

## Installation

### Prérequis

- Node.js et npm
- Une instance PostgreSQL accessible et une base vide créée pour le projet

### Configuration

Depuis la racine du dépôt :

```bash
npm install
cp .env.example .env
```

Renseigner les identifiants PostgreSQL dans `.env` et définir un secret JWT aléatoire. Pour générer ce secret :

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Copier la valeur générée dans `JWT_SECRET`.

| Variable | Rôle |
| --- | --- |
| `HOST` | Adresse d'écoute HTTP ; l'exemple utilise `127.0.0.1` |
| `PORT` | Port HTTP, `3000` par défaut |
| `JWT_SECRET` | Secret obligatoire pour signer et vérifier les JWT |
| `DB_HOST` | Hôte PostgreSQL local |
| `DB_PORT` | Port PostgreSQL, `5432` par défaut |
| `DB_DATABASE` | Nom de la base à créer, par exemple `fc26` |
| `DB_USERNAME` | Utilisateur PostgreSQL |
| `DB_PASSWORD` | Mot de passe PostgreSQL |
| `DATABASE_URL` | Alternative aux variables `DB_*`, prioritaire lorsqu'elle est renseignée |

Le code active SSL lorsque `DATABASE_URL` est renseignée. Pour une connexion locale sans SSL, utiliser les variables `DB_*` et laisser `DATABASE_URL` non définie.

PostgreSQL sert aux comptes utilisateurs. La connexion est néanmoins obligatoire au démarrage de l'ensemble du serveur. Les tables sont créées avec `sequelize.sync()` ; retrouver l'ancienne URL n'est donc pas nécessaire pour repartir avec de nouveaux comptes sur une base vide.

### Démarrage

Une fois le problème de configuration TypeScript corrigé :

```bash
npm run build
npm start
```

`npm start` reconstruit le projet puis lance `dist/app.js`. Le script `npm run dev` lance le mode développement via nodemon.

Exécuter les commandes depuis la racine du dépôt : les chemins vers les fichiers JSON sont résolus à partir du répertoire courant. Conserver `src/data/` accessible lors du lancement de la version compilée.

Avec la configuration d'exemple, l'API est accessible sur `http://127.0.0.1:3000/api`.

## Endpoints

### Football — accès public

| Méthode | Route | Paramètres / comportement |
| --- | --- | --- |
| GET | `/api/football` | Statistiques du dataset |
| GET | `/api/football/info` | `filter=club`, `national` ou `league` ; clubs par défaut |
| GET | `/api/football/players` | `filter=club`, `national` ou `league`, et `idValue=<id>` |
| GET | `/api/football/team/national` | `idValue=<id de nationalité>` ; joueurs ayant une équipe nationale renseignée |
| GET | `/api/football/players/search` | `query=<nom>` ; actuellement en erreur, correction prévue |
| GET | `/api/football/club/search` | `query=<nom du club>` |

Exemples :

```bash
curl 'http://127.0.0.1:3000/api/football'
curl 'http://127.0.0.1:3000/api/football/info?filter=club'
curl 'http://127.0.0.1:3000/api/football/players?filter=club&idValue=243'
curl 'http://127.0.0.1:3000/api/football/club/search?query=madrid'
```

Les réponses ne sont pas paginées actuellement.

### Authentification

| Méthode | Route | Corps JSON / accès |
| --- | --- | --- |
| POST | `/api/auth/register` | `email`, `username`, `password` ; `nickname` et `profile` optionnels |
| POST | `/api/auth/login` | `credential` (email ou pseudo) et `password` |
| GET | `/api/auth/me` | En-tête `Authorization: Bearer <token>` obligatoire |

Exemple d'inscription :

```bash
curl -X POST 'http://127.0.0.1:3000/api/auth/register' \
  -H 'Content-Type: application/json' \
  -d '{"email":"demo@example.com","username":"demo","password":"DemoPassword123!"}'
```

L'inscription et la connexion renvoient un objet contenant `user` et `token`. Le mot de passe haché est exclu de ces réponses.

```bash
curl 'http://127.0.0.1:3000/api/auth/me' \
  -H 'Authorization: Bearer <token>'
```

## Organisation du code

```text
src/
├── config/        # Configuration PostgreSQL et variables d'environnement
├── controllers/   # Traitement des requêtes et réponses HTTP
├── data/          # Datasets JSON
├── interfaces/    # Types utilisateurs, joueurs, ligues et JWT
├── middlewares/   # Validation, authentification et contrôle de rôle
├── models/        # Modèle Sequelize User
├── routes/        # Routes football et authentification
├── services/      # Filtrage des données, comptes et tokens
├── types/         # Extension des types Express
├── utils/         # Lecture JSON et exclusion du mot de passe
├── app.ts         # Point d'entrée
└── server.ts      # Configuration et démarrage du serveur
```
