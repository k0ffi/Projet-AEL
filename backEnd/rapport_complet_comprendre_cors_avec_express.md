# Rapport complet

## Comprendre CORS (Cross-Origin Resource Sharing)

### Dans un projet web Angular + Node.js / Express.js avec authentification

---

## 1. Introduction

Dans les architectures web modernes, il est très courant de séparer :

- un **frontend** (Angular, React, Vue)
- un **backend** (Node.js avec Express, Spring Boot, etc.)

Cette séparation implique souvent que le frontend et le backend fonctionnent sur **des origines différentes** (domaines, ports ou protocoles différents). C’est précisément dans ce contexte qu’intervient **CORS (Cross-Origin Resource Sharing)**.

Ce rapport a pour objectif d’expliquer CORS de manière claire et progressive, avec un focus particulier sur un projet **Angular (frontend)** communiquant avec une **API Express (backend)** pour l’authentification des utilisateurs.

---

## 2. Notion d’origine (Origin)

Une **origine** est définie par trois éléments :

- le protocole (http / https)
- le domaine (localhost, example.com)
- le port (4200, 3000, 80, etc.)

Exemples :

- http://localhost:4200
- http://localhost:3000

Même si le domaine est identique (`localhost`), **un port différent signifie une origine différente**.

---

## 3. Same-Origin Policy (SOP)

Les navigateurs modernes appliquent une règle de sécurité fondamentale appelée **Same-Origin Policy**.

Principe :

> Un script exécuté dans une page web ne peut pas accéder librement aux ressources d’une autre origine.

Objectifs :

- empêcher le vol de données sensibles
- limiter les attaques XSS et CSRF
- isoler les applications web entre elles

Conséquence directe :
Un frontend Angular ne peut **pas** appeler une API Express située sur une autre origine **sans autorisation explicite**.

---

## 4. Définition de CORS

**CORS (Cross-Origin Resource Sharing)** est un mécanisme standard basé sur des **headers HTTP** permettant à un serveur d’indiquer au navigateur :

> “Cette origine est autorisée à accéder à mes ressources.”

Important :

- CORS est **contrôlé par le navigateur**
- Le serveur ne bloque rien par lui-même
- Sans validation CORS, le navigateur bloque la réponse

---

## 5. Fonctionnement général de CORS

1. Angular envoie une requête HTTP vers l’API Express
2. Le navigateur intercepte la requête
3. Le navigateur vérifie les headers CORS de la réponse
4. Si les règles sont respectées → la réponse est transmise à Angular
5. Sinon → erreur CORS côté navigateur

---

## 6. Preflight Request (OPTIONS)

Pour certaines requêtes dites « complexes » (POST, PUT, headers personnalisés, Authorization…), le navigateur envoie d’abord une requête **OPTIONS**.

Cette requête sert à demander :

- quelles méthodes sont autorisées
- quels headers sont autorisés
- si les credentials sont acceptés

Cette étape est appelée **preflight request**.

Le middleware `cors` d’Express gère automatiquement cette phase.

---

## 7. CORS dans Express.js

### 7.1 Pourquoi un middleware ?

Express, par défaut, n’envoie **aucun header CORS**. Le middleware `cors` permet :

- d’ajouter automatiquement les headers nécessaires
- de centraliser la configuration
- d’éviter des erreurs complexes à déboguer

---

### 7.2 Installation

```bash
npm install cors
```

---

### 7.3 Utilisation basique (développement uniquement)

```js
const cors = require("cors");
app.use(cors());
```

⚠️ Autorise toutes les origines (à éviter en production).

---

## 8. Configuration CORS recommandée (Angular + Express)

### 8.1 Cas standard

- Frontend Angular : http://localhost:4200
- Backend Express : http://localhost:3000
- Authentification via JWT

```js
app.use(
  cors({
    origin: "http://localhost:4200",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
```

---

## 9. CORS et authentification

### 9.1 Authentification par JWT

- Le token est stocké côté client
- Il est envoyé dans le header Authorization

Exemple :

```
Authorization: Bearer <token>
```

Le header doit être explicitement autorisé par CORS.

---

### 9.2 Authentification par cookies / sessions

Configuration Express :

```js
app.use(
  cors({
    origin: "http://localhost:4200",
    credentials: true,
  }),
);
```

Configuration Angular :

```ts
this.http.post(url, data, { withCredentials: true });
```

Sans cela, les cookies sont bloqués.

---

## 10. Erreurs CORS fréquentes

- `Blocked by CORS policy`
- `No Access-Control-Allow-Origin header`
- Fonctionne avec Postman mais pas dans le navigateur

Rappel :
Postman ne respecte pas la Same-Origin Policy.

---

## 11. Bonnes pratiques

- Ne jamais utiliser `origin: '*'` en production
- Toujours limiter les origines autorisées
- Séparer configuration DEV / PROD
- Comprendre que CORS n’est pas une sécurité complète

---

## 12. Conclusion

CORS est une technologie essentielle dans les architectures web modernes. Bien qu’elle puisse sembler complexe au début, elle repose sur un principe simple : **le navigateur protège l’utilisateur et demande au serveur une autorisation explicite**.

Une bonne compréhension de CORS est indispensable pour développer des applications Angular communiquant avec des API Express, notamment lorsqu’il s’agit d’authentification et de données sensibles.

---

## 13. Ressources pour approfondir

- Documentation Express CORS
- Documentation MDN CORS
- Tutoriels Angular + JWT
- Vidéos explicatives sur la Same-Origin Policy
