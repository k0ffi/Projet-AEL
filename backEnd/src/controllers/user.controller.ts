import type { Request, Response } from "express";
import DBprocess from "../services/database.service.js";
import type { user } from "../models/user.js";
import bcrypt from "bcrypt";
import path from "path";
import { fileURLToPath } from "url";
import { TokenService, type TokenPayload } from "../services/token.service.js";
import type { AuthRequest } from "../middlewares/auth.middleware.js";

// Récupérer le répertoire courant en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Chemin vers le fichier JSON par défaut (production)
// Utilise process.cwd() pour avoir le chemin absolu depuis la racine du projet
const DEFAULT_DB_PATH = path.join(process.cwd(), "src", "data", "db.json");

// Instance du service de base de données
export const db = new DBprocess<user>();

// Variable pour suivre si la base de données est initialisée
let dbInitialized = false;

// Initialiser la base de données lowdb au démarrage
const initDb = async () => {
  try {
    await db.init(DEFAULT_DB_PATH, "users");
    dbInitialized = true;
    console.log("Base de données initialisée avec succès");
  } catch (error) {
    console.error(
      "Erreur lors de l'initialisation de la base de données:",
      error,
    );
  }
};

initDb();

/**
 * UserController - Gère les opérations CRUD pour les utilisateurs
 */
export class UserController {
  /**
   * GET /api/users - Récupère tous les utilisateurs
   */
  static async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await db.readData();
      // Ne pas retourner les mots de passe
      const usersWithoutPassword = users.map(({ password, ...user }) => user);
      res.json(usersWithoutPassword);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erreur lors de la récupération des utilisateurs" });
    }
  }

  /**
   * GET /api/users/:id - Récupère un utilisateur par ID
   */
  static async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      if (!id || typeof id !== "string") {
        res.status(400).json({ error: "ID invalide" });
        return;
      }

      const user = await db.findById(id);

      if (!user) {
        res.status(404).json({ error: "Utilisateur non trouvé" });
        return;
      }

      // Ne pas retourner le mot de passe
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erreur lors de la récupération de l'utilisateur" });
    }
  }

  /**
   * POST /api/users - Crée un nouvel utilisateur
   */
  static async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { nom, prenom, date_naissance, email, password } = req.body;

      // Vérification des champs requis
      if (!nom || !prenom || !email || !password) {
        res.status(400).json({
          error: "Tous les champs sont requis (nom, prenom, email, password)",
        });
        return;
      }

      // Vérifier si l'email existe déjà
      console.log("Recherche utilisateur avec email:", email);
      const existingUsers = await db.findBy(
        (u) => u.email?.toLowerCase() === email.toLowerCase(),
      );
      console.log("Utilisateurs trouvés:", existingUsers);

      if (existingUsers.length > 0) {
        console.log("Email déjà utilisé!");
        res.status(409).json({ error: "Cet email est déjà utilisé" });
        return;
      }

      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser: user = {
        id: String(Date.now()), // Générer un ID unique
        nom,
        prenom,
        date_naissance: new Date(date_naissance),
        email,
        password: hashedPassword,
        token: null,
        refreshToken: null,
        contrats: [], // Tableau vide de contrats
      };

      const createdUser = await db.createData(newUser);

      // Créer 2 contrats par défaut pour le nouvel utilisateur
      const allData = await db.readAllData();
      const userId = createdUser.id;
      const defaultContrats = [];

      const now = new Date().toISOString();

      // Contrat Électricité par défaut
      const contratElec = {
        id: `contrat_${userId}_001`,
        userId: userId,
        information: {
          reference: 3001,
          contrat_name: "Contrat Électricité Basic",
          activite: "Électricité",
          date_souscription: new Date().toLocaleDateString("fr-FR"),
          adresse: "Adresse à définir",
        },
        consommation: {
          labels: [
            "Janvier",
            "Février",
            "Mars",
            "Avril",
            "Mai",
            "Juin",
            "Juillet",
          ],
          datasets: [
            {
              label: "Consommation électrique (kWh)",
              backgroundColor: "rgb(255, 205, 86)",
              data: [100, 90, 80, 70, 60, 50, 55],
            },
          ],
        },
        facture: {
          montant: 50.0,
          reference: `FAC-ELEC-${Date.now()}-001`,
          date_facture: new Date().toLocaleDateString("fr-FR"),
        },
        date_creation: now,
        date_modification: now,
      };

      // Contrat Gaz par défaut
      const contratGaz = {
        id: `contrat_${userId}_002`,
        userId: userId,
        information: {
          reference: 3002,
          contrat_name: "Contrat Gaz Basic",
          activite: "Gaz Naturel",
          date_souscription: new Date().toLocaleDateString("fr-FR"),
          adresse: "Adresse à définir",
        },
        consommation: {
          labels: [
            "Janvier",
            "Février",
            "Mars",
            "Avril",
            "Mai",
            "Juin",
            "Juillet",
          ],
          datasets: [
            {
              label: "Consommation de gaz (m³)",
              backgroundColor: "rgb(255, 99, 132)",
              data: [80, 70, 60, 40, 20, 10, 15],
            },
          ],
        },
        facture: {
          montant: 45.0,
          reference: `FAC-GAZ-${Date.now()}-002`,
          date_facture: new Date().toLocaleDateString("fr-FR"),
        },
        date_creation: now,
        date_modification: now,
      };

      defaultContrats.push(contratElec, contratGaz);

      // Ajouter les contrats à la liste des contrats
      allData.contrats = [...allData.contrats, ...defaultContrats];

      // Mettre à jour l'utilisateur avec les IDs des contrats
      allData.users = allData.users.map((u: any) => {
        if (u.id === userId) {
          return {
            ...u,
            contrats: [
              "contrat_" + userId + "_001",
              "contrat_" + userId + "_002",
            ],
          };
        }
        return u;
      });

      await db.writeAllData(allData);

      // Récupérer l'utilisateur mis à jour avec les contrats
      const updatedUser = allData.users.find((u: any) => u.id === userId);

      // Ne pas retourner le mot de passe
      const { password: _, ...userWithoutPassword } = updatedUser;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erreur lors de la création de l'utilisateur" });
    }
  }

  /**
   * PUT /api/users/:id - Met à jour un utilisateur
   */
  static async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      if (!id || typeof id !== "string") {
        res.status(400).json({ error: "ID invalide" });
        return;
      }

      const { nom, prenom, date_naissance, email, password } = req.body;

      // Vérifier si l'utilisateur existe
      const existingUser = await db.findById(id);
      if (!existingUser) {
        res.status(404).json({ error: "Utilisateur non trouvé" });
        return;
      }

      // Préparer les données de mise à jour
      const updateData: Partial<user> = {};

      if (nom) updateData.nom = nom;
      if (prenom) updateData.prenom = prenom;
      if (date_naissance) updateData.date_naissance = new Date(date_naissance);
      if (email) {
        // Vérifier si le nouvel email n'est pas déjà utilisé par un autre utilisateur
        const existingUsers = await db.findBy(
          (u) => u.email === email && u.id !== id,
        );
        if (existingUsers.length > 0) {
          res.status(409).json({ error: "Cet email est déjà utilisé" });
          return;
        }
        updateData.email = email;
      }
      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }

      const updatedUser = await db.updateById(id, updateData);

      if (!updatedUser) {
        res.status(404).json({ error: "Utilisateur non trouvé" });
        return;
      }

      // Ne pas retourner le mot de passe
      const { password: _, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erreur lors de la mise à jour de l'utilisateur" });
    }
  }

  /**
   * DELETE /api/users/:id - Supprime un utilisateur
   */
  static async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      if (!id || typeof id !== "string") {
        res.status(400).json({ error: "ID invalide" });
        return;
      }

      // Vérifier si l'utilisateur existe
      const existingUser = await db.findById(id);
      if (!existingUser) {
        res.status(404).json({ error: "Utilisateur non trouvé" });
        return;
      }

      await db.deleteById(id);
      res.json({ message: "Utilisateur supprimé avec succès" });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erreur lors de la suppression de l'utilisateur" });
    }
  }

  /**
   * POST /api/users/login - Connexion d'un utilisateur
   * Retourne un access token et envoie le refresh token en cookie HttpOnly
   */
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: "Email et mot de passe requis" });
        return;
      }

      // Rechercher l'utilisateur par email
      const users = await db.findBy((u) => u.email === email);
      const user = users[0];

      if (!user) {
        res.status(401).json({ error: "Email ou mot de passe incorrect" });
        return;
      }

      // Vérifier le mot de passe
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res.status(401).json({ error: "Email ou mot de passe incorrect" });
        return;
      }

      // Générer les tokens JWT
      const tokenPayload: TokenPayload = {
        id: user.id,
        email: user.email,
        nom: user.nom,
        prenom: user.prenom,
      };

      console.log("Génération des tokens pour:", tokenPayload);

      const { accessToken, refreshToken } =
        TokenService.generateTokens(tokenPayload);

      console.log("Tokens générés, mise à jour du refreshToken dans la base");

      // Stocker le refresh token dans la base de données
      await db.updateById(user.id, { refreshToken });

      console.log("RefreshToken stocké");

      // Envoyer le refresh token en cookie HttpOnly sécurisé
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
      });

      // Ne pas retourner le mot de passe
      const { password: _, ...userWithoutPassword } = user;
      res.json({
        message: "Connexion réussie",
        accessToken,
        user: userWithoutPassword,
      });
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la connexion" });
    }
  }

  /**
   * POST /api/auth/refresh - Rafraîchir l'access token
   * Lit le refresh token depuis le cookie HttpOnly
   */
  static async refresh(req: Request, res: Response): Promise<void> {
    try {
      // Lire le refresh token depuis le cookie (envoyé automatiquement par le navigateur)
      const refreshToken = req.cookies?.refreshToken;

      if (!refreshToken) {
        res.status(400).json({ error: "Refresh token manquant" });
        return;
      }

      // Vérifier le refresh token
      const decoded = TokenService.verifyRefreshToken(refreshToken);
      if (!decoded) {
        res.status(401).json({ error: "Refresh token invalide ou expiré" });
        return;
      }

      // Rechercher l'utilisateur par ID
      const user = await db.findById(decoded.id);
      if (!user) {
        res.status(401).json({ error: "Utilisateur non trouvé" });
        return;
      }

      // Vérifier que le refresh token correspond à celui stocké
      if (user.refreshToken !== refreshToken) {
        res.status(401).json({ error: "Refresh token invalide" });
        return;
      }

      // Générer un nouveau access token
      const tokenPayload: TokenPayload = {
        id: user.id,
        email: user.email,
        nom: user.nom,
        prenom: user.prenom,
      };

      const accessToken = TokenService.generateAccessToken(tokenPayload);

      res.json({
        message: "Token rafraîchi avec succès",
        accessToken,
      });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erreur lors du rafraîchissement du token" });
    }
  }

  /**
   * POST /api/auth/logout - Déconnexion de l'utilisateur
   * Invalide le refresh token et efface le cookie
   */
  static async logout(req: AuthRequest, res: Response): Promise<void> {
    try {
      // Le middleware authenticateToken a déjà vérifié le token d'accès
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ error: "Utilisateur non authentifié" });
        return;
      }

      // Supprimer le refresh token de la base de données
      await db.updateById(userId, { refreshToken: null });

      // Effacer le cookie de refresh token
      res.clearCookie("refreshToken");

      res.json({ message: "Déconnexion réussie" });
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la déconnexion" });
    }
  }
}
