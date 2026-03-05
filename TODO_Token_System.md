# Plan: Système Complet de Token JWT pour Authentification

## Objectif

Créer un système complet de gestion des tokens JWT pour identifier et authentifier les utilisateurs avec access token et refresh token.

## ✅ Étapes RÉALISÉES et TESTÉES

### ✅ 1. Configuration de la clé secrète

- [x] Ajouter une clé secrète forte dans `auth.config.ts`
- [x] Configurer les durées d'expiration séparées:
  - Access token: 15 minutes
  - Refresh token: 7 jours

### ✅ 2. Correction du Middleware d'authentification

- [x] Corriger le bug: `authHeader(' ')[1]` → `authHeader.split(' ')[1]`
- [x] Implémenter la vérification complète du token JWT

### ✅ 3. Création d'un service de token

- [x] Créer `token.service.ts` avec:
  - Fonction `generateAccessToken(user)` pour créer un access token (15 min)
  - Fonction `generateRefreshToken(user)` pour créer un refresh token (7 jours)
  - Fonction `generateTokens(user)` pour créer les deux tokens
  - Fonction `verifyToken(token)` pour valider un access token
  - Fonction `verifyRefreshToken(token)` pour valider un refresh token
  - Fonction `decodeToken(token)` pour extraire les données
  - Fonction `isTokenExpired(token)` pour vérifier l'expiration

### ✅ 4. Création des routes d'authentification

- [x] Route `/api/auth/refresh` - Rafraîchir l'access token
- [x] Route `/api/auth/logout` - Déconnexion (invalider le refresh token)

### ✅ 5. Modification du login

- [x] Login retourne maintenant access token et refresh token
- [x] Le refresh token est stocké dans la base de données

## Fonctionnement du système

### 1. Inscription (`POST /api/users/register`)

```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"nom": "Dupont", "prenom": "Jean", "email": "jean@test.com", "password": "motdepasse"}'
```

### 2. Connexion (`POST /api/users/login`)

```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email": "jean@test.com", "password": "motdepasse"}'
```

**Réponse:**

```json
{
  "message": "Connexion réussie",
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": "1", "email": "...", "nom": "...", "prenom": "..." }
}
```

### 3. Accéder à une route protégée

```bash
curl http://localhost:3000/api/users \
  -H "Authorization: Bearer <accessToken>"
```

### 4. Rafraîchir l'access token (`POST /api/auth/refresh`)

Quand l'access token expire (après 15 minutes), utilisez le refresh token pour obtenir un nouveau access token:

```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken": "<votre-refresh-token>"}'
```

**Réponse:**

```json
{
  "message": "Token rafraîchi avec succès",
  "accessToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### 5. Déconnexion (`POST /api/auth/logout`)

```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer <accessToken>"
```

**Réponse:**

```json
{
  "message": "Déconnexion réussie"
}
```

## Sécurité

### Bonnes pratiques implémentées:

1. **Access token de courte durée (15 min)**: Réduit le risque en cas de vol de token
2. **Refresh token de longue durée (7 jours)**: Permet une connexion prolongée sans إعادة saisie
3. **Stockage du refresh token en base**: Permet l'invalidation à la déconnexion
4. **Vérification du refresh token**: Le serveur vérifie que le refresh token correspond à celui stocké

### Stockage côté client (recommandations pour le frontend Angular):

- **Access token**: Stocker en mémoire (dans un service Angular)
- **Refresh token**: Stocker dans un cookie HTTP Only (plus sécurisé)

## Fichiers modifiés/créés

- ✅ `backEnd/APIs/src/config/auth.config.ts` - Configuration avec durées d'expiration séparées
- ✅ `backEnd/APIs/src/middlewares/auth.middleware.ts` - Middleware d'authentification
- ✅ `backEnd/APIs/src/services/token.service.ts` - Service complet avec access et refresh tokens
- ✅ `backEnd/APIs/src/models/user.ts` - Modèle utilisateur avec champ refreshToken
- ✅ `backEnd/APIs/src/controllers/user.controller.ts` - Login, refresh et logout
- ✅ `backEnd/APIs/src/routes/auth.routes.ts` - NOUVEAU: Routes d'authentification
- ✅ `backEnd/APIs/src/serveur.ts` - Enregistrement des nouvelles routes
