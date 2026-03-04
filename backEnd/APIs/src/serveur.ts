import express from "express";
import cors from "cors";
import {
  authenticateToken,
  type AuthRequest,
} from "./middlewares/auth.middleware.js";
import { TokenService } from "./services/token.service.js";
import userRoutes from "./routes/user.routes.js";
import contratRoutes from "./routes/contrat.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Les Autorisations CORS pour le Front
app.use(
  cors({
    origin: "http://localhost:4200",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

// Route de test publique
app.get("/api/test", (req, res) => {
  res.json({ message: "Sucess !!" });
});

// Routes des utilisateurs
app.use(userRoutes);

// Routes des contrats
app.use(contratRoutes);

// Routes d'authentification (refresh token, logout)
app.use(authRoutes);

/**
 * Route protégée - nécessite un token valide
 */
app.get("/api/profile", authenticateToken, (req: AuthRequest, res) => {
  // req.user contient les informations du token
  res.json({
    message: "Accès autorisé aux données protégées",
    user: req.user,
  });
});

/**
 * Route pour vérifier si un token est expiré
 */
app.get("/api/token-status", authenticateToken, (req: AuthRequest, res) => {
  const authHeader = req.headers["authorization"] as string;
  const parts = authHeader.split(" ");
  const token: string = parts[1] as string;

  res.json({
    message: "Token valide",
    timeUntilExpiration: TokenService.getTimeUntilExpiration(token),
    isExpired: TokenService.isTokenExpired(token),
  });
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  console.log(`URL: http://localhost:${PORT}`);
  console.log(`\n Routes disponibles:`);
  console.log(`  POST /api/users/register   - Inscription`);
  console.log(
    `  POST /api/users/login      - Connexion (retourne access et refresh tokens)`,
  );
  console.log(`  POST /api/auth/refresh     - Rafraîchir l'access token`);
  console.log(`  POST /api/auth/logout      - Déconnexion`);
  console.log(`  GET  /api/users            - Liste utilisateurs (protégé)`);
  console.log(`  GET  /api/users/:id        - Détail utilisateur (protégé)`);
  console.log(`  PUT  /api/users/:id        - Modifier utilisateur (protégé)`);
  console.log(`  DELETE /api/users/:id      - Supprimer utilisateur (protégé)`);
});
