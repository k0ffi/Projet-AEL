import type { Request, Response } from "express";
import DBprocess from "../services/database.service.js";
import type { user } from "../models/user.js";
import bcrypt from "bcrypt";
import path from "path";

// Chemin vers le fichier JSON
const DB_PATH = path.join(__dirname, "..", "data", "db.json");

// Instance du service de base de données
const db = new DBprocess<user>();

/**
 * UserController - Gère les opérations CRUD pour les utilisateurs
 */
export class UserController {
  /**
   * GET /api/users - Récupère tous les utilisateurs
   */
  static async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await db.readData(DB_PATH);
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

      const user = await db.findById(DB_PATH, id);

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
        res
          .status(400)
          .json({
            error: "Tous les champs sont requis (nom, prenom, email, password)",
          });
        return;
      }

      // Vérifier si l'email existe déjà
      const existingUsers = await db.findBy(DB_PATH, (u) => u.email === email);
      if (existingUsers.length > 0) {
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
      };

      const createdUser = await db.createData(DB_PATH, newUser);

      // Ne pas retourner le mot de passe
      const { password: _, ...userWithoutPassword } = createdUser;
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
      const existingUser = await db.findById(DB_PATH, id);
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
          DB_PATH,
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

      const updatedUser = await db.updateById(DB_PATH, id, updateData);

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
      const existingUser = await db.findById(DB_PATH, id);
      if (!existingUser) {
        res.status(404).json({ error: "Utilisateur non trouvé" });
        return;
      }

      await db.deleteById(DB_PATH, id);
      res.json({ message: "Utilisateur supprimé avec succès" });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erreur lors de la suppression de l'utilisateur" });
    }
  }

  /**
   * POST /api/users/login - Connexion d'un utilisateur
   */
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ error: "Email et mot de passe requis" });
        return;
      }

      // Rechercher l'utilisateur par email
      const users = await db.findBy(DB_PATH, (u) => u.email === email);
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

      // Ne pas retourner le mot de passe
      const { password: _, ...userWithoutPassword } = user;
      res.json({
        message: "Connexion réussie",
        user: userWithoutPassword,
      });
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la connexion" });
    }
  }
}
