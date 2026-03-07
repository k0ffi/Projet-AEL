# Spécification Technique du Projet AEL (Application Énergie Lyon)

## Table des Matières

1. [Vue d'Ensemble](#vue-densemble)
2. [Architecture du Projet](#architecture-du-projet)
3. [Backend (API REST)](#backend-api-rest)
4. [Frontend (Angular)](#frontend-angular)
5. [Base de Données](#base-de-données)
6. [Authentification et Sécurité](#authentification-et-sécurité)
7. [API Endpoints](#api-endpoints)
8. [Modèle de Données](#modèle-de-données)

---

## 1. Vue d'Ensemble

### Description du Projet

AEL (Application Énergie Lyon) est une application web permettant aux utilisateurs de gérer leurs contrats d'énergie (électricité, gaz, eau). Les utilisateurs peuvent consulter leurs contrats, visualiser leur consommation et payer leurs factures.

### Technologies Utilisées

#### Backend

- **Runtime**: Node.js avec Express.js
- **Langage**: TypeScript
- **Base de données**: JSON file-based (lowdb)
- **Authentification**: JWT (Access Token + Refresh Token)
- **Tests**: Vitest

#### Frontend

- **Framework**: Angular 17+ (Standalone Components)
- **UI Library**: Angular Material
- **HTTP Client**: Angular HttpClient
- **Charts**: Chart.js
- **Tests**: Karma/Jasmine

---

## 2. Architecture du Projet

```
Project/
├── backEnd/                    # Serveur API REST
│   ├── src/
│   │   ├── config/           # Configuration (auth.config.ts)
│   │   ├── controllers/      # Contrôleurs métier
│   │   │   ├── user.controller.ts
│   │   │   └── contrat.controller.ts
│   │   ├── data/             # Base de données JSON
│   │   │   └── db.json
│   │   ├── middlewares/      # Middlewares Express
│   │   │   ├── auth.middleware.ts
│   │   │   └── logger.middleware.ts
│   │   ├── models/           # Modèles TypeScript
│   │   │   ├── user.ts
│   │   │   └── contrat.ts
│   │   ├── routes/           # Routes Express
│   │   │   ├── user.routes.ts
│   │   │   ├── contrat.routes.ts
│   │   │   └── auth.routes.ts
│   │   ├── services/         # Services métier
│   │   │   ├── database.service.ts
│   │   │   └── token.service.ts
│   │   ├── tests/            # Tests unitaires
│   │   │   └── unit/
│   │   └── serveur.ts        # Point d'entrée
│   ├── package.json
│   └── tsconfig.json
│
└── frontEnd/                  # Application Angular
    ├── src/
    │   ├── app/
    │   │   ├── core/
    │   │   │   ├── guards/
    │   │   │   │   └── auth.guard.ts
    │   │   │   ├── interceptors/
    │   │   │   │   └── auth.interceptor.ts
    │   │   │   └── services/
    │   │   │       ├── auth.service.ts
    │   │   │       ├── contrat.service.ts
    │   │   │       └── layout.service.ts
    │   │   ├── features/
    │   │   │   ├── login/
    │   │   │   │   └── login.ts
    │   │   │   ├── sign-up/
    │   │   │   │   └── sign-up.ts
    │   │   │   ├── dashboard/
    │   │   │   │   └── dashboard.ts
    │   │   │   └── entete/
    │   │   │       └── entete.ts
    │   │   ├── pages/
    │   │   │   ├── accueil/
    │   │   │   │   └── accueil.ts
    │   │   │   ├── connexion/
    │   │   │   │   └── connexion.ts
    │   │   │   └── inscription/
    │   │   │       └── inscription.ts
    │   │   ├── shared/
    │   │   │   ├── beans/
    │   │   │   ├── components/
    │   │   │   │   ├── consommation-chart/
    │   │   │   │   ├── contrat-detail/
    │   │   │   │   ├── date-piker/
    │   │   │   │   ├── error-snackbar/
    │   │   │   │   ├── facture-card/
    │   │   │   │   ├── menu/
    │   │   │   │   └── success-snackbar/
    │   │   │   └── models/
    │   │   │       └── contrat.model.ts
    │   │   ├── AEL.routes.ts
    │   │   ├── app.config.ts
    │   │   ├── app.routes.ts
    │   │   └── app.ts
    │   ├── styles.css
    │   └── main.ts
    ├── angular.json
    ├── package.json
    └── tsconfig.json
```

---

## 3. Backend (API REST)

### Structure des Contrôleurs

#### UserController

Gère les opérations CRUD sur les utilisateurs et l'authentification.

```typescript
// Méthodes disponibles :
-getAllUsers() - // GET /api/users
  getUserById() - // GET /api/users/:id
  createUser() - // POST /api/users/register
  updateUser() - // PUT /api/users/:id
  deleteUser() - // DELETE /api/users/:id
  login() - // POST /api/users/login
  refresh() - // POST /api/auth/refresh
  logout(); // POST /api/auth/logout
```

#### ContratController

Gère les opérations CRUD sur les contrats.

```typescript
// Méthodes disponibles :
-createContrat() - // POST /api/contrats
  getContratsByUser() - // GET /api/contrats/user/:userId
  getContratById() - // GET /api/contrats/:id
  updateContrat() - // PUT /api/contrats/:id
  deleteContrat(); // DELETE /api/contrats/:id
```

### Services

#### DatabaseService

Service de gestion de la base de données JSON utilisant lowdb.

```typescript
// Méthodes disponibles :
-init(path, collection) - // Initialise la connexion
  readData() - // Lit toutes les données
  readAllData() - // Lit toutes les collections
  findBy(predicate) - // Recherche avec prédicat
  findById(id) - // Recherche par ID
  createData(data) - // Crée un élément
  updateById(id, data) - // Met à jour par ID
  deleteById(id) - // Supprime par ID
  writeAllData(data); // Écrit toutes les données
```

#### TokenService

Service de gestion des tokens JWT.

```typescript
// Méthodes disponibles :
-generateTokens(payload) - // Génère access + refresh tokens
  generateAccessToken(payload) - // Génère access token
  generateRefreshToken(payload) - // Génère refresh token
  verifyAccessToken(token) - // Vérifie access token
  verifyRefreshToken(token) - // Vérifie refresh token
  isTokenExpired(token) - // Vérifie expiration
  getTimeUntilExpiration(); // Temps jusqu'à expiration
```

### Middlewares

#### auth.middleware.ts

Middleware d'authentification JWT.

```typescript
// Fonction principale :
- authenticateToken(req, res, next)
  - Vérifie le token JWT dans le header Authorization
  - Ajoute les infos utilisateur à req.user
  - Retourne 401 si token invalide
```

#### logger.middleware.ts

Middleware de logging des requêtes HTTP.

```typescript
// Fonction principale :
- loggerMiddleware(req, res, next)
  - Log la méthode, l'URL et le timestamp
  - Mesure le temps de traitement
```

---

## 4. Frontend (Angular)

### Structure des Modules

#### Core Module

Contient les services singleton et les guards.

**Services :**

- `AuthService` : Gestion de l'authentification (login, register, logout, refresh token)
- `ContratService` : Gestion des contrats (CRUD)
- `LayoutService` : Gestion de l'état de l'interface (sidebar, loggedIn)

**Guards :**

- `AuthGuard` : Protection des routes nécessitant une authentification

**Interceptors :**

- `AuthInterceptor` : Ajoute le token JWT aux requêtes HTTP

#### Features

Composants standalone pour les fonctionnalités principales :

- **login** : Page de connexion
- **sign-up** : Page d'inscription (multi-étapes avec MatStepper)
- **dashboard** : Tableau de bord avec graphiques et factures
- **entete** : Header de l'application

#### Shared

Composants et modèles partagés :

**Composants :**

- `consommation-chart` : Graphique de consommation (Chart.js)
- `contrat-detail` : Détails d'un contrat
- `facture-card` : Carte de facture
- `date-piker` : Sélecteur de date Angular Material
- `error-snackbar` / `success-snackbar` : Notifications

**Modèles :**

- `Contrat` : Modèle de contrat avec informations, consommation et facture

---

## 5. Base de Données

### Structure JSON (db.json)

```json
{
  "users": [
    {
      "id": "string",
      "nom": "string",
      "prenom": "string",
      "date_naissance": "Date",
      "email": "string",
      "password": "string (hashed)",
      "token": "string | null",
      "refreshToken": "string | null",
      "contrats": ["string"] // IDs des contrats
    }
  ],
  "contrats": [
    {
      "id": "string",
      "userId": "string",
      "information": {
        "reference": "number",
        "contrat_name": "string",
        "activite": "string",
        "date_souscription": "string",
        "adresse": "string"
      },
      "consommation": {
        "labels": ["string"],
        "datasets": [
          {
            "label": "string",
            "backgroundColor": "string",
            "data": ["number"]
          }
        ]
      },
      "facture": {
        "montant": "number",
        "reference": "string",
        "date_facture": "string"
      },
      "date_creation": "Date",
      "date_modification": "Date"
    }
  ]
}
```

---

## 6. Authentification et Sécurité

### Système JWT à Double Token

#### Access Token

- **Durée**: 15 minutes
- **Stockage**: localStorage (frontend) + mémoire
- **Usage**: Authentification des requêtes API

#### Refresh Token

- **Durée**: 7 jours
- **Stockage**: Cookie HttpOnly (sécurisé)
- **Usage**: Renouvellement automatique de l'access token

### Flux d'Authentification

1. **Inscription** (`POST /api/users/register`)
   - Validation des champs requis
   - Vérification de l'unicité de l'email
   - Hachage du mot de passe (bcrypt, 10 rounds)
   - Création de 2 contrats par défaut (Électricité, Gaz)
   - Retourne l'utilisateur sans mot de passe

2. **Connexion** (`POST /api/users/login`)
   - Vérification email/mot de passe
   - Génération des tokens JWT
   - Stockage du refresh token en cookie HttpOnly
   - Retourne accessToken + données utilisateur

3. **Rafraîchissement** (`POST /api/auth/refresh`)
   - Lecture du refresh token depuis le cookie
   - Vérification de la validité
   - Génération d'un nouvel access token

4. **Déconnexion** (`POST /api/auth/logout`)
   - Invalidation du refresh token
   - Effacement du cookie

### Sécurité CORS

```typescript
app.use(
  cors({
    origin: true, // Permet toutes les origines
    credentials: true, // Autorise les cookies
  }),
);
```

---

## 7. API Endpoints

### Routes Utilisateurs

| Méthode | Endpoint              | Auth | Description           |
| ------- | --------------------- | ---- | --------------------- |
| POST    | `/api/users/register` | Non  | Inscription           |
| POST    | `/api/users/login`    | Non  | Connexion             |
| GET     | `/api/users`          | Oui  | Liste utilisateurs    |
| GET     | `/api/users/:id`      | Oui  | Détails utilisateur   |
| PUT     | `/api/users/:id`      | Oui  | Modifier utilisateur  |
| DELETE  | `/api/users/:id`      | Oui  | Supprimer utilisateur |

### Routes Authentification

| Méthode | Endpoint            | Auth | Description      |
| ------- | ------------------- | ---- | ---------------- |
| POST    | `/api/auth/refresh` | Non  | Rafraîchir token |
| POST    | `/api/auth/logout`  | Oui  | Déconnexion      |

### Routes Contrats

| Méthode | Endpoint                     | Auth | Description                |
| ------- | ---------------------------- | ---- | -------------------------- |
| POST    | `/api/contrats`              | Oui  | Créer contrat              |
| GET     | `/api/contrats/user/:userId` | Oui  | Liste contrats utilisateur |
| GET     | `/api/contrats/:id`          | Oui  | Détails contrat            |
| PUT     | `/api/contrats/:id`          | Oui  | Modifier contrat           |
| DELETE  | `/api/contrats/:id`          | Oui  | Supprimer contrat          |

---

## 8. Modèle de Données

### User Interface

```typescript
interface user {
  id: string;
  nom: string;
  prenom: string;
  date_naissance: Date;
  email: string;
  password: string;
  token: string | null;
  refreshToken: string | null;
  contrats: string[];
}
```

### Contrat Interface

```typescript
interface Contrat {
  id: string;
  userId: string;
  information: {
    reference: number;
    contrat_name: string;
    activite: string;
    date_souscription: string;
    adresse: string;
  };
  consommation: {
    labels: string[];
    datasets: {
      label: string;
      backgroundColor: string;
      data: number[];
    }[];
  };
  facture: {
    montant: number;
    reference: string;
    date_facture: string;
  };
  date_creation: string;
  date_modification: string;
}
```

---

## Installation et Lancement

### Backend

```bash
cd backEnd
npm install
npm start  # Lance sur localhost:3000
```

### Frontend

```bash
cd frontEnd
npm install
npm start  # Lance sur localhost:4200
```

### Tests

```bash
# Backend
cd backEnd
npm test

# Frontend
cd frontEnd
npm test
```

---

## Notes de Développement

- Le système d'authentification utilise des cookies HttpOnly pour le refresh token afin de prévenir les attaques XSS
- Les mots de passe sont hachés avec bcrypt (10 rounds)
- Chaque nouvel utilisateur reçoit 2 contrats par défaut lors de l'inscription
- Le dashboard affiche les statistiques agrégées de tous les contrats de l'utilisateur
