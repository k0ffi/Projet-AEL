import type { Request, Response, NextFunction } from "express";
import { TokenService, type DecodedToken } from "../services/token.service.js";

export interface AuthRequest extends Request {
  user?: DecodedToken;
}

/**
 * Middleware pour authentifier les routes protégées par JWT
 * Le token doit être envoyé dans le header: Authorization: Bearer <token>
 */
export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  // Récupérer le header Authorization
  const authHeader = req.headers["authorization"] as string | undefined;

  // Vérifier si le header existe
  if (!authHeader) {
    res.status(401).json({
      error: "Token manquant",
      message: "Veuillez fournir un token d'authentification",
    });
    return;
  }

  // Vérifier le format "Bearer <token>"
  const parts = (authHeader as string).split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    res.status(401).json({
      error: "Format de token invalide",
      message: "Le format doit être: Bearer <token>",
    });
    return;
  }

  const token: string = parts[1] as string;

  // Vérifier que le token existe
  if (!token) {
    res.status(401).json({
      error: "Token manquant",
      message: "Le format doit être: Bearer <token>",
    });
    return;
  }

  // Vérifier le token
  const decoded = TokenService.verifyToken(token);

  if (!decoded) {
    res.status(403).json({
      error: "Token invalide ou expiré",
      message: "Veuillez vous reconnecter",
    });
    return;
  }

  // Ajouter les informations utilisateur à la requête
  req.user = decoded;

  next();
};
