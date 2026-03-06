import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import {
  authenticateToken,
  type AuthRequest,
} from "../middlewares/auth.middleware.js";

const router = Router();

// POST /api/auth/refresh - Rafraîchir l'access token (pas besoin d'authentification)
router.post("/api/auth/refresh", UserController.refresh);

// POST /api/auth/logout - Déconnexion (nécessite un access token valide)
router.post("/api/auth/logout", authenticateToken, UserController.logout);

export default router;
