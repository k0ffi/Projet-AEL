import { Router } from "express";
import { ContratController } from "../controllers/contrat.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const router = Router();

// Routes protégées (nécessitent un token)
// POST /api/contrats - Créer un contrat
router.post(
  "/api/contrats",
  authenticateToken,
  ContratController.createContrat,
);

// GET /api/contrats/user/:userId - Récupérer tous les contrats d'un utilisateur
router.get(
  "/api/contrats/user/:userId",
  authenticateToken,
  ContratController.getContratsByUser,
);

// GET /api/contrats/:id - Récupérer un contrat par ID
router.get(
  "/api/contrats/:id",
  authenticateToken,
  ContratController.getContratById,
);

// PUT /api/contrats/:id - Mettre à jour un contrat
router.put(
  "/api/contrats/:id",
  authenticateToken,
  ContratController.updateContrat,
);

// DELETE /api/contrats/:id - Supprimer un contrat
router.delete(
  "/api/contrats/:id",
  authenticateToken,
  ContratController.deleteContrat,
);

export default router;
