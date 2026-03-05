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
  iat: number; // temps d'émission
  exp: number; // temps d'expiration
}

/**
 * Service pour gérer les tokens JWT (Access et Refresh)
 */
export class TokenService {
  /**
   * Génère un access token JWT pour un utilisateur (courte durée: 15min)
   */
  static generateAccessToken(user: TokenPayload): string {
    const payload = {
      id: user.id,
      email: user.email,
      nom: user.nom,
      prenom: user.prenom,
    };

    const options: SignOptions = {
      expiresIn: authConfig.accessTokenExpiresIn as const,
    };
    return jwt.sign(payload, authConfig.secret, options);
  }

  /**
   * Génère un refresh token JWT pour un utilisateur (longue durée: 7 jours)
   */
  static generateRefreshToken(user: TokenPayload): string {
    const payload = {
      id: user.id,
      email: user.email,
      type: "refresh", // Marque ce token comme refresh token
    };

    const options: SignOptions = {
      expiresIn: authConfig.refreshTokenExpiresIn as const,
    };
    return jwt.sign(payload, authConfig.secret, options);
  }

  /**
   * Génère les deux tokens (access et refresh) pour un utilisateur
   */
  static generateTokens(user: TokenPayload): {
    accessToken: string;
    refreshToken: string;
  } {
    return {
      accessToken: this.generateAccessToken(user),
      refreshToken: this.generateRefreshToken(user),
    };
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
   * Vérifie et décode un refresh token JWT
   * @returns Le token décodé si valide, null si invalide
   */
  static verifyRefreshToken(token: string): DecodedToken | null {
    try {
      const decoded = jwt.verify(token, authConfig.secret) as DecodedToken & {
        type?: string;
      };

      // Vérifier que c'est bien un refresh token
      if (decoded.type !== "refresh") {
        console.error("Ce n'est pas un refresh token");
        return null;
      }

      return decoded;
    } catch (error) {
      console.error("Erreur de vérification du refresh token:", error);
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
