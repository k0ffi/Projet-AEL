import { describe, it, expect, beforeEach, afterEach } from "vitest";
import DBprocess from "../../services/database.service";
import fs from "fs/promises";
import path from "path";

interface TestUser {
  id?: number | string;
  nom: string;
  prenom: string;
  email: string;
}

describe("DatabaseService (DBprocess)", () => {
  const testFilePath = path.join(__dirname, "..", "..", "data", "test-db.json");
  const db = new DBprocess<TestUser>();

  const testData: TestUser[] = [
    { id: 1, nom: "Dupont", prenom: "Jean", email: "jean@test.com" },
    { id: 2, nom: "Martin", prenom: "Marie", email: "marie@test.com" },
  ];

  // Initialiser la base de données avant les tests
  beforeEach(async () => {
    // Créer un fichier de test avec les données initiales
    await fs.writeFile(
      testFilePath,
      JSON.stringify({ users: testData }),
      "utf-8",
    );
    // Initialiser lowdb avec le fichier de test
    await db.init(testFilePath, "users");
  });

  afterEach(async () => {
    // Supprimer le fichier de test après chaque test
    try {
      await fs.unlink(testFilePath);
    } catch {
      // Ignorer si le fichier n'existe pas
    }
  });

  describe("readData", () => {
    it("devrait lire les données depuis un fichier JSON", async () => {
      const data = await db.readData();
      expect(data).toHaveLength(2);
      expect(data[0].nom).toBe("Dupont");
    });

    it("devrait retourner un tableau vide si le fichier n existe pas", async () => {
      // Créer une nouvelle instance pour tester avec un fichier inexistant
      // Utiliser un répertoire temporaire valide
      const tempDir = path.join(__dirname, "..", "..", "data", "temp");
      await fs.mkdir(tempDir, { recursive: true });

      const db2 = new DBprocess<TestUser>();
      await db2.init(path.join(tempDir, "inexistant.json"), "users");
      const data = await db2.readData();
      expect(data).toEqual([]);

      // Nettoyer
      await fs.rm(tempDir, { recursive: true, force: true });
    });
  });

  describe("writeData", () => {
    it("devrait écrire des données dans un fichier JSON", async () => {
      const newData: TestUser[] = [
        { id: 1, nom: "Test", prenom: "User", email: "test@test.com" },
      ];
      await db.writeData(newData);

      const data = await db.readData();
      expect(data).toHaveLength(1);
      expect(data[0].nom).toBe("Test");
    });
  });

  describe("createData", () => {
    it("devrait ajouter de nouvelles données", async () => {
      const newUser: TestUser = {
        nom: "Nouveau",
        prenom: "User",
        email: "nouveau@test.com",
      };
      const created = await db.createData(newUser);

      expect(created.id).toBeDefined();
      expect(created.nom).toBe("Nouveau");

      const data = await db.readData();
      expect(data).toHaveLength(3);
    });

    it("devrait générer un ID automatique si non fourni", async () => {
      const newUser: TestUser = {
        nom: "Test",
        prenom: "User",
        email: "test@test.com",
      };
      const created = await db.createData(newUser);

      expect(created.id).toBe(3); // 2 exist + 1 nouveau
    });
  });

  describe("findById", () => {
    it("devrait trouver un élément par ID", async () => {
      const user = await db.findById("1");

      expect(user).not.toBeNull();
      expect(user?.nom).toBe("Dupont");
    });

    it("devrait retourner null si non trouvé", async () => {
      const user = await db.findById("999");
      expect(user).toBeNull();
    });
  });

  describe("findBy", () => {
    it("devrait trouver des éléments par prédicat", async () => {
      const users = await db.findBy((u: TestUser) => u.nom === "Dupont");

      expect(users).toHaveLength(1);
      expect(users[0].prenom).toBe("Jean");
    });
  });

  describe("updateById", () => {
    it("devrait mettre à jour un élément par ID", async () => {
      const updated = await db.updateById("1", { nom: "Dupont-Modifié" });

      expect(updated).not.toBeNull();
      expect(updated?.nom).toBe("Dupont-Modifié");
    });

    it("devrait lancer une erreur si non trouvé", async () => {
      await expect(db.updateById("999", { nom: "Test" })).rejects.toThrow(
        "L'élément avec l'id: 999 n'existe pas",
      );
    });
  });

  describe("deleteById", () => {
    it("devrait supprimer un élément par ID", async () => {
      await db.deleteById("1");

      const data = await db.readData();
      expect(data).toHaveLength(1);
      expect(data[0].nom).toBe("Martin");
    });

    it("devrait lancer une erreur si non trouvé", async () => {
      await expect(db.deleteById("999")).rejects.toThrow(
        "L'élément avec l'id: 999 n'existe pas",
      );
    });
  });
});
