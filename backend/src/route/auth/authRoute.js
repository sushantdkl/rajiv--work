import express from "express";
import { authController } from "../../controller/index.js";
const router = express.Router();

router.post("/login", authController.login);
router.post("/admin/login", authController.adminLogin);

export { router as authRouter };
