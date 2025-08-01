import express from "express";
import { contactController } from "../controller/index.js";

const router = express.Router();

// POST /api/contacts - Submit contact form
router.post("/", contactController.submitContact);

// GET /api/contacts - Get all contact submissions (for admin)
router.get("/", contactController.getAllContacts);

export default router;
