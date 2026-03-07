import type { Request, Response } from "express";
import DBprocess from "../services/database.service.js";
import type { contrat } from "../models/contrat.js";
import type { user } from "../models/user.js";

// Import de l'instance db du user controller pour partager la même DB
import { db as dbUsers } from "./user.controller.js";

// Alias pour l'instance partagée
const db = dbUsers;

/**
 * ContratController - Gère les opérations CRUD pour les contrats
 * Les contrats sont stockés dans un tableau "contrats" dans le fichier JSON
 */
export class ContratController {
  /**
   * POST /api/contrats - Crée un nouveau contrat
   */
  static async createContrat(req: Request, res: Response): Promise<void> {
    try {
      const { userId, information, consommation, facture } = req.body;

      // Vérification des champs requis
      if (!userId || !information || !consommation || !facture) {
        res.status(400).json({
          error:
            "Tous les champs sont requis (userId, information, consommation, facture)",
        });
        return;
      }

      // Lire toutes les données
      const allData = await db.readAllData();

      // Vérifier si l'utilisateur existe
      const userIndex = allData.users.findIndex((u: any) => u.id === userId);
      if (userIndex === -1) {
        res.status(404).json({ error: "Utilisateur non trouvé" });
        return;
      }

      const now = new Date().toISOString();

      const newContrat: contrat = {
        id: String(Date.now()), // Générer un ID unique
        userId,
        information,
        consommation,
        facture,
        date_creation: now,
        date_modification: now,
      };

      // Ajouter le contrat au tableau des contrats
      const contratsList = allData.contrats || [];
      contratsList.push(newContrat);
      allData.contrats = contratsList;

      // Ajouter l'ID du contrat à l'utilisateur
      const userContrats = allData.users[userIndex].contrats || [];
      allData.users[userIndex].contrats = [...userContrats, newContrat.id];

      await db.writeAllData(allData);

      res.status(201).json(newContrat);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la création du contrat" });
    }
  }

  /**
   * GET /api/contrats/user/:userId - Récupère tous les contrats d'un utilisateur
   */
  static async getContratsByUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;
      if (!userId || typeof userId !== "string") {
        res.status(400).json({ error: "ID utilisateur invalide" });
        return;
      }

      // Lire toutes les données
      const allData = await db.readAllData();

      // Vérifier si l'utilisateur existe
      const user = allData.users.find((u: any) => u.id === userId);
      if (!user) {
        res.status(404).json({ error: "Utilisateur non trouvé" });
        return;
      }

      // Récupérer les contrats de l'utilisateur
      const contratsList = allData.contrats || [];
      const userContrats = contratsList.filter(
        (c: contrat) => c.userId === userId,
      );

      res.json(userContrats);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erreur lors de la récupération des contrats" });
    }
  }

  /**
   * GET /api/contrats/:id - Récupère un contrat par ID
   */
  static async getContratById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      if (!id || typeof id !== "string") {
        res.status(400).json({ error: "ID invalide" });
        return;
      }

      const allData = await db.readAllData();
      const contratsList = allData.contrats || [];
      const contrat = contratsList.find((c: contrat) => c.id === id);

      if (!contrat) {
        res.status(404).json({ error: "Contrat non trouvé" });
        return;
      }

      res.json(contrat);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erreur lors de la récupération du contrat" });
    }
  }

  /**
   * PUT /api/contrats/:id - Met à jour un contrat
   */
  static async updateContrat(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      if (!id || typeof id !== "string") {
        res.status(400).json({ error: "ID invalide" });
        return;
      }

      const { information, consommation, facture } = req.body;

      const allData = await db.readAllData();
      const contratsList = allData.contrats || [];
      const contratIndex = contratsList.findIndex((c: contrat) => c.id === id);

      if (contratIndex === -1) {
        res.status(404).json({ error: "Contrat non trouvé" });
        return;
      }

      // Mettre à jour le contrat
      const updatedContrat = {
        ...contratsList[contratIndex],
        ...(information && { information }),
        ...(consommation && { consommation }),
        ...(facture && { facture }),
        date_modification: new Date().toISOString(),
      };

      allData.contrats[contratIndex] = updatedContrat;

      await db.writeAllData(allData);

      res.json(updatedContrat);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erreur lors de la mise à jour du contrat" });
    }
  }

  /**
   * DELETE /api/contrats/:id - Supprime un contrat
   */
  static async deleteContrat(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      if (!id || typeof id !== "string") {
        res.status(400).json({ error: "ID invalide" });
        return;
      }

      const allData = await db.readAllData();
      const contratsList = allData.contrats || [];
      const contratIndex = contratsList.findIndex((c: contrat) => c.id === id);

      if (contratIndex === -1) {
        res.status(404).json({ error: "Contrat non trouvé" });
        return;
      }

      const userId = contratsList[contratIndex].userId;

      // Supprimer le contrat de la liste des contrats
      allData.contrats = contratsList.filter((c: contrat) => c.id !== id);

      // Supprimer l'ID du contrat de l'utilisateur
      const userIndex = allData.users.findIndex((u: any) => u.id === userId);
      if (userIndex !== -1) {
        const userContrats = allData.users[userIndex].contrats || [];
        allData.users[userIndex].contrats = userContrats.filter(
          (cId: string) => cId !== id,
        );
      }

      await db.writeAllData(allData);

      res.json({ message: "Contrat supprimé avec succès" });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erreur lors de la suppression du contrat" });
    }
  }
}

// Exporter db pour les tests
export { db };
