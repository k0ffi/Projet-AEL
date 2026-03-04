import jwt, { type SignOptions } from "jsonwebtoken";
import { authConfig } from "../config/auth.config.js";

// Interface pour le payload du token
export interface TokenPayload {
  id: string;
  email: string;
  nom: string;
  prenom: string;
}

// Interface pour le token décodé (avec les données standard JWT)
export interface DecodedToken extends TokenPayload {
  iat: number; // Issued At
  exp: number; // Expiration Time
}

/**
 * Service pour gérer les tokens JWT
 */
export class TokenService {
  /**
   * Génère un token JWT pour un utilisateur
   */
  static generateToken(user: TokenPayload): string {
    const payload = {
      id: user.id,
      email: user.email,
      nom: user.nom,
      prenom: user.prenom,
    };

    const options: SignOptions = {
      expiresIn: "1h" as const,
    };
    return jwt.sign(payload, authConfig.secret, options); // genere un token avec l'utilisateur , le secret , et le temps d'expiration
  }

  /**
   * Vérifie et décode un token JWT
   * @returns Le token décodé si valide, null si invalide
   */
  static verifyToken(token: string): DecodedToken | null {
    try {
      return jwt.verify(token, authConfig.secret) as DecodedToken;
    } catch (error) {
      console.error("Erreur de vérification du token:", error);
      return null;
    }
  }

  /**
   * Décode un token sans vérifier la signature (utiliser avec précaution)
   * Utile pour extraire des informations avant expiration
   */
  static decodeToken(token: string): DecodedToken | null {
    try {
      return jwt.decode(token) as DecodedToken;
    } catch (error) {
      console.error("Erreur de décodage du token:", error);
      return null;
    }
  }

  /**
   * Vérifie si un token est expiré
   */
  static isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) {
      return true;
    }
    return Date.now() >= decoded.exp * 1000;
  }

  /**
   * Extrait le temps restant avant expiration du token (en secondes)
   */
  static getTimeUntilExpiration(token: string): number {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) {
      return 0;
    }
    const remaining = decoded.exp * 1000 - Date.now();
    return Math.max(0, Math.floor(remaining / 1000));
  }
}
