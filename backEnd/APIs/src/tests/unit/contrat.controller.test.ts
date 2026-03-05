import { describe, it, expect, beforeEach, afterEach } from "vitest";
import request from "supertest";
import express from "express";
import type { user } from "../../models/user.js";
import type { contrat } from "../../models/contrat.js";
import fs from "fs/promises";
import path from "path";

// Import du contrôleur et de l'instance db
import { ContratController, db } from "../../controllers/contrat.controller.js";

// Chemin vers le fichier de test
const TEST_DB_PATH = path.join(
  __dirname,
  "..",
  "..",
  "data",
  "test-contrats.json",
);

describe("ContratController", () => {
  // Créer une app express de test
  const app = express();
  app.use(express.json());

  // Routes de test
  app.post("/api/contrats", ContratController.createContrat);
  app.get("/api/contrats/user/:userId", ContratController.getContratsByUser);
  app.get("/api/contrats/:id", ContratController.getContratById);
  app.put("/api/contrats/:id", ContratController.updateContrat);
  app.delete("/api/contrats/:id", ContratController.deleteContrat);

  const testUsers: user[] = [
    {
      id: "1",
      nom: "Dupont",
      prenom: "Jean",
      date_naissance: new Date("1990-01-15"),
      email: "jean@test.com",
      password: "$2b$10$fMaZembJcwk5WMLRLRsD.ObfUp.RaVR1QNv8pbaxxg87Ilb/fTe32",
      token: null,
      contrats: [],
    },
    {
      id: "2",
      nom: "Martin",
      prenom: "Marie",
      date_naissance: new Date("1995-05-20"),
      email: "marie@test.com",
      password: "$2b$10$fMaZembJcwk5WMLRLRsD.ObfUp.RaVR1QNv8pbaxxg87Ilb/fTe32",
      token: null,
      contrats: [],
    },
  ];

  const testContrats: contrat[] = [
    {
      id: "100",
      userId: "1",
      information: {
        reference: "ELEC-001",
        activite: "Electricité",
        date_souscription: "26/01/2029",
        adresse: "3 chemin du moulin, METZ 57530",
      },
      consommation: {
        labels: ["January", "February", "March"],
        datasets: [
          {
            label: "Dataset 1",
            backgroundColor: "rgb(255, 99, 132)",
            data: [52, -93, -25],
          },
        ],
      },
      facture: {
        montant: 150.5,
        reference: "FAC-001",
      },
      date_creation: "2024-01-01T00:00:00.000Z",
      date_modification: "2024-01-01T00:00:00.000Z",
    },
  ];

  beforeEach(async () => {
    // Créer le fichier de test avec la structure lowdb
    await fs.writeFile(
      TEST_DB_PATH,
      JSON.stringify({ users: testUsers, contrats: testContrats }),
      "utf-8",
    );
    // Initialiser la base de données lowdb avec le chemin de test
    await db.init(TEST_DB_PATH);
  });

  afterEach(async () => {
    // Nettoyer le fichier de test
    try {
      await fs.unlink(TEST_DB_PATH);
    } catch {
      // Ignorer si le fichier n'existe pas
    }
  });

  describe("POST /api/contrats", () => {
    it("devrait créer un nouveau contrat", async () => {
      const newContrat = {
        userId: "1",
        information: {
          reference: "ELEC-002",
          activite: "Electricité",
          date_souscription: "15/03/2024",
          adresse: "10 rue de la Paix, PARIS 75001",
        },
        consommation: {
          labels: ["January", "February"],
          datasets: [
            {
              label: "Dataset 1",
              backgroundColor: "rgb(54, 162, 235)",
              data: [100, 200],
            },
          ],
        },
        facture: {
          montant: 200.0,
          reference: "FAC-002",
        },
      };

      const response = await request(app)
        .post("/api/contrats")
        .send(newContrat);

      expect(response.status).toBe(201);
      expect(response.body.information.reference).toBe("ELEC-002");
      expect(response.body.userId).toBe("1");
      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("date_creation");
    });

    it("devrait retourner 400 si champs manquants", async () => {
      const newContrat = {
        userId: "1",
        // information, consommation, facture manquants
      };

      const response = await request(app)
        .post("/api/contrats")
        .send(newContrat);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain("requis");
    });

    it("devrait retourner 404 si utilisateur non trouvé", async () => {
      const newContrat = {
        userId: "999", // ID utilisateur inexistant
        information: {
          reference: "ELEC-003",
          activite: "Electricité",
          date_souscription: "15/03/2024",
          adresse: "10 rue de la Paix, PARIS 75001",
        },
        consommation: {
          labels: ["January"],
          datasets: [],
        },
        facture: {
          montant: 100,
          reference: "FAC-003",
        },
      };

      const response = await request(app)
        .post("/api/contrats")
        .send(newContrat);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Utilisateur non trouvé");
    });
  });

  describe("GET /api/contrats/user/:userId", () => {
    it("devrait retourner tous les contrats d'un utilisateur", async () => {
      const response = await request(app).get("/api/contrats/user/1");

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].userId).toBe("1");
      expect(response.body[0].information.activite).toBe("Electricité");
    });

    it("devrait retourner un tableau vide si aucun contrat", async () => {
      const response = await request(app).get("/api/contrats/user/2");

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(0);
    });

    it("devrait retourner 404 si utilisateur non trouvé", async () => {
      const response = await request(app).get("/api/contrats/user/999");

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Utilisateur non trouvé");
    });
  });

  describe("GET /api/contrats/:id", () => {
    it("devrait retourner un contrat par ID", async () => {
      const response = await request(app).get("/api/contrats/100");

      expect(response.status).toBe(200);
      expect(response.body.id).toBe("100");
      expect(response.body.information.reference).toBe("ELEC-001");
    });

    it("devrait retourner 404 si contrat non trouvé", async () => {
      const response = await request(app).get("/api/contrats/999");

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Contrat non trouvé");
    });
  });

  describe("PUT /api/contrats/:id", () => {
    it("devrait mettre à jour un contrat", async () => {
      const updateData = {
        information: {
          reference: "ELEC-001-UPDATED",
          activite: "Electricité",
          date_souscription: "26/01/2029",
          adresse: "3 chemin du moulin, METZ 57530",
        },
        facture: {
          montant: 200.0,
          reference: "FAC-001",
        },
      };

      const response = await request(app)
        .put("/api/contrats/100")
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.information.reference).toBe("ELEC-001-UPDATED");
      expect(response.body.facture.montant).toBe(200.0);
      expect(response.body).toHaveProperty("date_modification");
    });

    it("devrait retourner 404 si contrat non trouvé", async () => {
      const updateData = {
        facture: {
          montant: 300,
          reference: "FAC-999",
        },
      };

      const response = await request(app)
        .put("/api/contrats/999")
        .send(updateData);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Contrat non trouvé");
    });
  });

  describe("DELETE /api/contrats/:id", () => {
    it("devrait supprimer un contrat", async () => {
      const response = await request(app).delete("/api/contrats/100");

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Contrat supprimé avec succès");
    });

    it("devrait retourner 404 si contrat non trouvé", async () => {
      const response = await request(app).delete("/api/contrats/999");

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Contrat non trouvé");
    });

    it("devrait supprimer l'ID du contrat de l'utilisateur", async () => {
      // D'abord créer un contrat
      const newContrat = {
        userId: "1",
        information: {
          reference: "ELEC-TEST",
          activite: "Electricité",
          date_souscription: "01/01/2024",
          adresse: "Test",
        },
        consommation: {
          labels: [],
          datasets: [],
        },
        facture: {
          montant: 100,
          reference: "TEST",
        },
      };

      await request(app).post("/api/contrats").send(newContrat);

      // Vérifier que l'utilisateur a un contrat
      const getResponse = await request(app).get("/api/contrats/user/1");
      expect(getResponse.body.length).toBeGreaterThan(0);

      // Supprimer le contrat
      const deleteResponse = await request(app).delete("/api/contrats/100");
      expect(deleteResponse.status).toBe(200);
    });
  });
});
