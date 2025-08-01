import express from "express";
import { getDashboardData } from "../controller/adminDashboardController.js";
import { authenticateToken } from "../middleware/token-middleware.js";
import { verifyAdminRole } from "../middleware/admin-middleware.js";

const router = express.Router();

// Apply both authentication and admin role verification
router.use(authenticateToken);
router.use(verifyAdminRole);

// Get dashboard data for admin
router.get("/dashboard", getDashboardData);

export default router;