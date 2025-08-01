import express from "express";
import { getAllOrders, updateOrderStatus } from "../controller/adminOrderController.js";
import { authenticateToken } from "../middleware/token-middleware.js";
import { verifyAdminRole } from "../middleware/admin-middleware.js";

const router = express.Router();

// Apply both authentication and admin role verification
router.use(authenticateToken);
router.use(verifyAdminRole);

// Get all orders for admin
router.get("/", getAllOrders);

// Update order status for admin
router.put("/:orderId/status", updateOrderStatus);

export default router;
