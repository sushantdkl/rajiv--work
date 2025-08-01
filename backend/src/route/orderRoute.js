import express from "express";
import { createOrder, getOrdersByUser } from "../controller/orderController.js";

const router = express.Router();

// Create a new order
router.post("/", createOrder);

// Get orders by userId
router.get("/user/:userId", getOrdersByUser);

export default router;
