import { describe, it, expect, beforeEach, afterEach } from "vitest";
import request from "supertest";
import express from "express";
import type { user } from "../../models/user.js";
import fs from "fs/promises";
import path from "path";

// Import du contrôleur et de l'instance db
import { UserController, db } from "../../controllers/user.controller.js";

// Chemin vers le fichier de test
const TEST_DB_PATH = path.join(
  __dirname,
  "..",
  "..",
  "data",
  "test-users.json",
);

describe("UserController", () => {
  // Créer une app express de test
  const app = express();
  app.use(express.json());

  // Routes de test
  app.get("/api/users", UserController.getAllUsers);
  app.get("/api/users/:id", UserController.getUserById);
  app.post("/api/users", UserController.createUser);
  app.put("/api/users/:id", UserController.updateUser);
  app.delete("/api/users/:id", UserController.deleteUser);
  app.post("/api/users/login", UserController.login);

  const testUsers: user[] = [
    {
      id: "1",
      nom: "Dupont",
      prenom: "Jean",
      date_naissance: new Date("1990-01-15"),
      email: "jean@test.com",
      password: "$2b$10$fMaZembJcwk5WMLRLRsD.ObfUp.RaVR1QNv8pbaxxg87Ilb/fTe32", // hash for 'password1'
      token: null,
      contrats: [],
    },
    {
      id: "2",
      nom: "Martin",
      prenom: "Marie",
      date_naissance: new Date("1995-05-20"),
      email: "marie@test.com",
      password: "$2b$10$fMaZembJcwk5WMLRLRsD.ObfUp.RaVR1QNv8pbaxxg87Ilb/fTe32", // hash for 'password1'
      token: null,
      contrats: [],
    },
  ];

  beforeEach(async () => {
    // Créer le fichier de test avec la structure lowdb
    await fs.writeFile(
      TEST_DB_PATH,
      JSON.stringify({ users: testUsers }),
      "utf-8",
    );
    // Initialiser la base de données lowdb avec le chemin de test
    await db.init(TEST_DB_PATH, "users");
  });

  afterEach(async () => {
    // Nettoyer le fichier de test
    try {
      await fs.unlink(TEST_DB_PATH);
    } catch {
      // Ignorer si le fichier n'existe pas
    }
  });

  describe("GET /api/users", () => {
    it("devrait retourner tous les utilisateurs sans mot de passe", async () => {
      const response = await request(app).get("/api/users");

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).not.toHaveProperty("password");
      expect(response.body[0].email).toBe("jean@test.com");
    });

    it("devrait retourner un tableau vide si aucun utilisateur", async () => {
      // Supprimer tous les utilisateurs
      await db.writeData([]);

      const response = await request(app).get("/api/users");

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(0);
    });
  });

  describe("GET /api/users/:id", () => {
    it("devrait retourner un utilisateur par ID", async () => {
      const response = await request(app).get("/api/users/1");

      expect(response.status).toBe(200);
      expect(response.body.nom).toBe("Dupont");
      expect(response.body).not.toHaveProperty("password");
    });

    it("devrait retourner 404 si utilisateur non trouvé", async () => {
      const response = await request(app).get("/api/users/999");

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Utilisateur non trouvé");
    });

    it("devrait retourner 200 si ID invalide (trailing slash)", async () => {
      const response = await request(app).get("/api/users/");

      // Express traite /api/users/ comme /api/users et retourne tous les utilisateurs
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
    });
  });

  describe("POST /api/users", () => {
    it("devrait créer un nouvel utilisateur", async () => {
      const newUser = {
        nom: "Nouveau",
        prenom: "User",
        date_naissance: "2000-01-01",
        email: "nouveau@test.com",
        password: "password123",
      };

      const response = await request(app).post("/api/users").send(newUser);

      expect(response.status).toBe(201);
      expect(response.body.nom).toBe("Nouveau");
      expect(response.body.email).toBe("nouveau@test.com");
      expect(response.body).not.toHaveProperty("password");
    });

    it("devrait retourner 400 si champs manquants", async () => {
      const newUser = {
        nom: "Nouveau",
        prenom: "User",
        // email et password manquants
      };

      const response = await request(app).post("/api/users").send(newUser);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain("requis");
    });

    it("devrait retourner 409 si email déjà utilisé", async () => {
      const newUser = {
        nom: "Dupont",
        prenom: "Jean",
        date_naissance: "1990-01-15",
        email: "jean@test.com", // Email existant
        password: "password123",
      };

      const response = await request(app).post("/api/users").send(newUser);

      expect(response.status).toBe(409);
      expect(response.body.error).toBe("Cet email est déjà utilisé");
    });
  });

  describe("PUT /api/users/:id", () => {
    it("devrait mettre à jour un utilisateur", async () => {
      const updateData = {
        nom: "Dupont-Modifié",
        prenom: "Jean-Michel",
      };

      const response = await request(app).put("/api/users/1").send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.nom).toBe("Dupont-Modifié");
      expect(response.body.prenom).toBe("Jean-Michel");
    });

    it("devrait retourner 404 si utilisateur non trouvé", async () => {
      const updateData = {
        nom: "Test",
      };

      const response = await request(app)
        .put("/api/users/999")
        .send(updateData);

      expect(response.status).toBe(404);
    });

    it("devrait retourner 409 si nouvel email déjà utilisé", async () => {
      const updateData = {
        email: "marie@test.com", // Email d'un autre utilisateur
      };

      const response = await request(app).put("/api/users/1").send(updateData);

      expect(response.status).toBe(409);
      expect(response.body.error).toBe("Cet email est déjà utilisé");
    });
  });

  describe("DELETE /api/users/:id", () => {
    it("devrait supprimer un utilisateur", async () => {
      const response = await request(app).delete("/api/users/1");

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Utilisateur supprimé avec succès");
    });

    it("devrait retourner 404 si utilisateur non trouvé", async () => {
      const response = await request(app).delete("/api/users/999");

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Utilisateur non trouvé");
    });
  });

  describe("POST /api/users/login", () => {
    it("devrait connecter un utilisateur avec les bons identifiants", async () => {
      const response = await request(app).post("/api/users/login").send({
        email: "jean@test.com",
        password: "password1", // Mot de passe correspondant au hash
      });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Connexion réussie");
      expect(response.body.user.email).toBe("jean@test.com");
    });

    it("devrait retourner 401 si email incorrect", async () => {
      const response = await request(app).post("/api/users/login").send({
        email: "inexistant@test.com",
        password: "password",
      });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Email ou mot de passe incorrect");
    });

    it("devrait retourner 400 si email manquant", async () => {
      const response = await request(app).post("/api/users/login").send({
        password: "password",
      });

      expect(response.status).toBe(400);
    });
  });
});
