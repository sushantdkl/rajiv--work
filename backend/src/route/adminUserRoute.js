import express from "express";
import { getAllUsers, deleteUser } from "../controller/adminUserController.js";
import { authenticateToken } from "../middleware/token-middleware.js";
import { verifyAdminRole } from "../middleware/admin-middleware.js";

const router = express.Router();

// Apply both authentication and admin role verification
router.use(authenticateToken);
router.use(verifyAdminRole);

// Get all users for admin
router.get("/", getAllUsers);

// Delete user by ID for admin
router.delete("/:userId", deleteUser);

export default router;