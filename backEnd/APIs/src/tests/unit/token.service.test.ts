import { describe, it, expect, beforeEach } from "vitest";
import {
  TokenService,
  type TokenPayload,
} from "../../services/token.service.js";

describe("TokenService", () => {
  const validPayload: TokenPayload = {
    id: "1",
    email: "test@example.com",
    nom: "Doe",
    prenom: "John",
  };

  describe("generateToken", () => {
    it("devrait générer un token JWT valide", () => {
      const token = TokenService.generateAccessToken(validPayload);

      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
      expect(token.split(".")).toHaveLength(3); // JWT format: header.payload.signature
    });

    it("devrait inclure les informations utilisateur dans le token", () => {
      const token = TokenService.generateAccessToken(validPayload);
      const decoded = TokenService.decodeToken(token);

      expect(decoded).not.toBeNull();
      expect(decoded?.id).toBe(validPayload.id);
      expect(decoded?.email).toBe(validPayload.email);
      expect(decoded?.nom).toBe(validPayload.nom);
      expect(decoded?.prenom).toBe(validPayload.prenom);
    });
  });

  describe("verifyToken", () => {
    it("devrait retourner le token décodé si valide", () => {
      const token = TokenService.generateAccessToken(validPayload);
      const decoded = TokenService.verifyToken(token);

      expect(decoded).not.toBeNull();
      expect(decoded?.id).toBe(validPayload.id);
      expect(decoded?.email).toBe(validPayload.email);
    });

    it("devrait retourner null si token invalide", () => {
      const decoded = TokenService.verifyToken("token.invalide");

      expect(decoded).toBeNull();
    });

    it("devrait retourner null si token modifié", () => {
      const token = TokenService.generateAccessToken(validPayload);
      const modifiedToken = token.slice(0, -5) + "xxxxx";
      const decoded = TokenService.verifyToken(modifiedToken);

      expect(decoded).toBeNull();
    });
  });

  describe("decodeToken", () => {
    it("devrait décoder le token sans vérifier la signature", () => {
      const token = TokenService.generateAccessToken(validPayload);
      const decoded = TokenService.decodeToken(token);

      expect(decoded).not.toBeNull();
      expect(decoded?.id).toBe(validPayload.id);
    });

    it("devrait retourner null pour un token invalide", () => {
      const decoded = TokenService.decodeToken("token.invalide");

      expect(decoded).toBeNull();
    });
  });

  describe("isTokenExpired", () => {
    it("devrait retourner false pour un token valide", () => {
      const token = TokenService.generateAccessToken(validPayload);
      const isExpired = TokenService.isTokenExpired(token);

      expect(isExpired).toBe(false);
    });

    it("devrait retourner true pour un token expiré", () => {
      // Créer un token expiré manuellement avec un temps d'expiration passé
      const expiredPayload = {
        ...validPayload,
        exp: Math.floor(Date.now() / 1000) - 3600, // Expiré il y a 1 heure
        iat: Math.floor(Date.now() / 1000) - 7200,
      };
      // Ce test vérifie le cas où exp est dans le passé
      const isExpired = TokenService.isTokenExpired(
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJub20iOiJEb2UiLCJwcmVub20iOiJKb2huIiwiaWF0IjoxNzAwMDAwMDAwLCJleHAiOjE3MDAwMDAwMDB9.signature",
      );

      expect(isExpired).toBe(true);
    });

    it("devrait retourner true pour un token vide", () => {
      const isExpired = TokenService.isTokenExpired("");

      expect(isExpired).toBe(true);
    });
  });

  describe("getTimeUntilExpiration", () => {
    it("devrait retourner le temps restant en secondes pour un token valide", () => {
      const token = TokenService.generateAccessToken(validPayload);
      const timeLeft = TokenService.getTimeUntilExpiration(token);

      // Devrait être proche de 900 secondes (15 minutes)
      expect(timeLeft).toBeGreaterThan(800);
      expect(timeLeft).toBeLessThanOrEqual(900);
    });

    it("devrait retourner 0 pour un token expiré", () => {
      const expiredToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJub20iOiJEb2UiLCJwcmVub20iOiJKb2huIiwiaWF0IjoxNzAwMDAwMDAwLCJleHAiOjB9.signature";
      const timeLeft = TokenService.getTimeUntilExpiration(expiredToken);

      expect(timeLeft).toBe(0);
    });

    it("devrait retourner 0 pour un token vide", () => {
      const timeLeft = TokenService.getTimeUntilExpiration("");

      expect(timeLeft).toBe(0);
    });
  });
});
