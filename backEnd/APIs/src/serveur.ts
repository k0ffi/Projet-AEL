import express from "express";
import cors from "cors";
import {
  authenticateToken,
  type AuthRequest,
} from "./middlewares/auth.middleware.js";
import { TokenService, type TokenPayload } from "./services/token.service.js";

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

/**
 * EXEMPLE: Route de login pour générer un token
 */
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  // TODO: Vérifier les credentials dans la base de données
  // Pour l'exemple, on simule un utilisateur valide
  if (email && password) {
    const userPayload: TokenPayload = {
      id: "1",
      email: email,
      nom: "Doe",
      prenom: "John",
    };

    // Générer le token
    const token = TokenService.generateToken(userPayload);

    res.json({
      message: "Connexion réussie",
      token: token,
      user: {
        id: userPayload.id,
        email: userPayload.email,
        nom: userPayload.nom,
        prenom: userPayload.prenom,
      },
    });
  } else {
    res.status(400).json({ error: "Email et mot de passe requis" });
  }
});

/**
 * EXEMPLE: Route protégée - nécessite un token valide
 */
app.get("/api/profile", authenticateToken, (req: AuthRequest, res) => {
  // req.user contient les informations du token
  res.json({
    message: "Accès autorisé aux données protégées",
    user: req.user,
  });
});

/**
 * EXEMPLE: Route pour vérifier si un token est expiré
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
  console.log(`\n Routes d'authentification:`);
  console.log(`  POST /api/login    - Pour obtenir un token`);
  console.log(
    `  GET  /api/profile   - Route protégée (需 Authorization: Bearer <token>)`,
  );
  console.log(`  GET  /api/token-status - Vérifier le statut du token`);
});
