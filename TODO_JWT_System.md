# TODO: Implémentation du Système JWT avec Access et Refresh Tokens

## Étapes à compléter

### 1. Mise à jour du Modèle Utilisateur

- [x] Ajouter le champ `refreshToken` au modèle user

### 2. Mise à jour de la Configuration Auth

- [x] Configurer les durées d'expiration séparées (15min access, 7 jours refresh)

### 3. Mise à jour du Service de Token

- [x] Ajouter `generateAccessToken()`
- [x] Ajouter `generateRefreshToken()`
- [x] Ajouter `verifyRefreshToken()`

### 4. Mise à jour du Controller Utilisateur

- [x] Modifier `login` pour générer access et refresh tokens
- [x] Ajouter méthode `refresh`
- [x] Ajouter méthode `logout`

### 5. Créer les Routes d'Authentification

- [x] Créer `POST /api/auth/refresh`
- [x] Créer `POST /api/auth/logout`

### 6. Mettre à jour le Serveur Principal

- [x] Enregistrer les nouvelles routes d'authentification

### 7. Mettre à jour la Documentation

- [x] Documenter les nouveaux endpoints dans TODO_Token_System.md

## Résumé des Tests

✅ **Login** - Retourne accessToken et refreshToken
✅ **Refresh** - Permet d'obtenir un nouveau accessToken avec le refreshToken
✅ **Logout** - Invalide le refreshToken
