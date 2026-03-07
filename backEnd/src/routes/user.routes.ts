import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const router = Router();

// Routes publiques
router.post("/api/users/register", UserController.createUser);
router.post("/api/users/login", UserController.login);

// Routes protégées (nécessitent un token)
router.get("/api/users", authenticateToken, UserController.getAllUsers);
router.get("/api/users/:id", authenticateToken, UserController.getUserById);
router.put("/api/users/:id", authenticateToken, UserController.updateUser);
router.delete("/api/users/:id", authenticateToken, UserController.deleteUser);

export default router;
