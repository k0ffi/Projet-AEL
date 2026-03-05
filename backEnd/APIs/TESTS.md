# Spécification des Tests du Backend

Ce document définit la spécification des tests pour le projet backend.

---

## 1. DatabaseService (DBprocess)

**Fichier source:** `src/services/database.service.ts`  
**Type générique:** `DBprocess<T extends DBObject>` où `DBObject = { id?: number | string }`

### 1.1 Méthode `readData`

**Signature:** `async readData(filePath: string): Promise<T[]>`

**Spécification:**

- Lit le contenu d'un fichier JSON
- Parse et retourne le tableau de données
- Retourne un tableau vide `[]` si le fichier n'existe pas
- Lance une erreur si le JSON est invalide

**Tests:**

- [x] Lecture successful d'un fichier JSON valide
- [x] Retourne un tableau vide quand le fichier n'existe pas

---

### 1.2 Méthode `writeData`

**Signature:** `async writeData(filePath: string, data: T[]): Promise<void>`

**Spécification:**

- Écrit les données dans un fichier JSON
- Formate le JSON avec indentation (2 espaces)
- Écrase le contenu existant

**Tests:**

- [x] Écriture successful dans un nouveau fichier

---

### 1.3 Méthode `createData`

**Signature:** `async createData(filePath: string, newData: T): Promise<T>`

**Spécification:**

- Lit les données existantes
- Génère un ID automatique si non fourni (incrémentation du max ID)
- Ajoute les nouvelles données au tableau
- Écrit le tout dans le fichier
- Retourne l'élément créé avec son ID

**Tests:**

- [x] Création avec ID fourni
- [x] Création sans ID (génération automatique)
- [x] ID généré est incrémenté correctement

---

### 1.4 Méthode `findById`

**Signature:** `async findById(filePath: string, id: string): Promise<T | null>`

**Spécification:**

- Recherche un élément par son ID
- Convertit l'ID en string pour la comparaison
- Retourne l'élément trouvé ou `null` si absent

**Tests:**

- [x] Retourne l'élément quand trouvé
- [x] Retourne `null` quand non trouvé

---

### 1.5 Méthode `findBy`

**Signature:** `async findBy(filePath: string, predicate: (item: T) => boolean): Promise<T[]>`

**Spécification:**

- Filtre les éléments selon un prédicat
- Retourne un tableau avec tous les éléments correspondants

**Tests:**

- [x] Retourne les éléments correspondants
- [ ] Retourne un tableau vide si aucun correspondant

---

### 1.6 Méthode `updateById`

**Signature:** `async updateById(filePath: string, id: string, updatedData: Partial<T>): Promise<T | null>`

**Spécification:**

- Met à jour un élément par son ID
- Fusionne les données existantes avec les nouvelles
- Écrit le tout dans le fichier
- Retourne l'élément mis à jour
- Lance une erreur si l'élément n'existe pas

**Tests:**

- [x] Mise à jour successful
- [x] Lance une erreur si l'ID n'existe pas

---

### 1.7 Méthode `deleteById`

**Signature:** `async deleteById(filePath: string, id: string): Promise<void>`

**Spécification:**

- Supprime un élément par son ID
- Écrit le tableau mis à jour dans le fichier
- Lance une erreur si l'élément n'existe pas

**Tests:**

- [x] Suppression successful
- [x] Lance une erreur si l'ID n'existe pas

---

## 2. TokenService (À faire)

**Fichier source:** `src/services/token.service.ts`

### 2.1 Méthode `generateToken`

**Signature:** `static generateToken(user: TokenPayload): string`

**Tests:**

- [ ] Génère un token JWT valide
- [ ] Le token contient les bonnes informations

### 2.2 Méthode `verifyToken`

**Signature:** `static verifyToken(token: string): DecodedToken | null`

**Tests:**

- [ ] Retourne le token décodé si valide
- [ ] Retourne null si invalide

### 2.3 Méthode `decodeToken`

**Signature:** `static decodeToken(token: string): DecodedToken | null`

**Tests:**

- [ ] Décode le token sans vérifier la signature

### 2.4 Méthode `isTokenExpired`

**Signature:** `static isTokenExpired(token: string): boolean`

**Tests:**

- [ ] Retourne true si expiré
- [ ] Retourne false si valide

### 2.5 Méthode `getTimeUntilExpiration`

**Signature:** `static getTimeUntilExpiration(token: string): number`

**Tests:**

- [ ] Retourne le temps restant en secondes

---

## 3. UserController

**Fichier source:** `src/controllers/user.controller.ts`

### 3.1 Méthode `getAllUsers`

**Signature:** `static async getAllUsers(req: Request, res: Response): Promise<void>`

**Spécification:**

- Retourne tous les utilisateurs de la base de données
- Ne retourne pas les mots de passe (security)
- Utilise le header `x-db-path` pour les tests, sinon utilise le chemin par défaut

**Tests:**

- [x] Retourne tous les utilisateurs sans mot de passe
- [x] Retourne un tableau vide si aucun utilisateur

---

### 3.2 Méthode `getUserById`

**Signature:** `static async getUserById(req: Request, res: Response): Promise<void>`

**Spécification:**

- Retourne un utilisateur par son ID
- Retourne 404 si non trouvé
- Retourne 400 si ID invalide
- Ne retourne pas le mot de passe

**Tests:**

- [x] Retourne un utilisateur par ID
- [x] Retourne 404 si utilisateur non trouvé
- [x] Retourne 200 si ID invalide (trailing slash - comportement Express)

---

### 3.3 Méthode `createUser`

**Signature:** `static async createUser(req: Request, res: Response): Promise<void>`

**Spécification:**

- Crée un nouvel utilisateur
- Vérifie que tous les champs requis sont présents (nom, prenom, email, password)
- Vérifie que l'email n'est pas déjà utilisé
- Hash le mot de passe avec bcrypt
- Retourne 201 si créé avec succès

**Tests:**

- [x] Crée un nouvel utilisateur
- [x] Retourne 400 si champs manquants
- [x] Retourne 409 si email déjà utilisé

---

### 3.4 Méthode `updateUser`

**Signature:** `static async updateUser(req: Request, res: Response): Promise<void>`

**Spécification:**

- Met à jour un utilisateur par son ID
- Vérifie que l'utilisateur existe
- Vérifie que le nouvel email n'est pas déjà utilisé par un autre utilisateur
- Hash le mot de passe si fourni

**Tests:**

- [x] Met à jour un utilisateur
- [x] Retourne 404 si utilisateur non trouvé
- [x] Retourne 409 si nouvel email déjà utilisé

---

### 3.5 Méthode `deleteUser`

**Signature:** `static async deleteUser(req: Request, res: Response): Promise<void>`

**Spécification:**

- Supprime un utilisateur par son ID
- Vérifie que l'utilisateur existe avant suppression

**Tests:**

- [x] Supprime un utilisateur
- [x] Retourne 404 si utilisateur non trouvé

---

### 3.6 Méthode `login`

**Signature:** `static async login(req: Request, res: Response): Promise<void>`

**Spécification:**

- Authentifie un utilisateur avec email et mot de passe
- Retourne 400 si email ou mot de passe manquant
- Retourne 401 si email ou mot de passe incorrect
- Retourne le token et les infos utilisateur (sans mot de passe) si succès

**Tests:**

- [x] Connecte un utilisateur avec les bons identifiants
- [x] Retourne 401 si email incorrect
- [x] Retourne 400 si email manquant

---

## 4. Routes API (À faire)

**Fichier source:** `src/routes/user.routes.ts`

---

## Résumé des tests

| Module          | Total | Complétés | En attente |
| --------------- | ----- | --------- | ---------- |
| DatabaseService | 13    | 13        | 0 ✅       |
| TokenService    | 13    | 13        | 0 ✅       |
| UserController  | 16    | 16        | 0 ✅       |
| Routes API      | -     | -         | -          |

---

## Commandes

```bash
# Exécuter tous les tests
npx vitest run

# Exécuter en mode watch
npx vitest

# Avec coverage
npx vitest run --coverage
```
