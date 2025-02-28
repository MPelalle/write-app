import express from "express";
import { register, verifyEmail, login, getUserProfile } from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.get("/verify/:token", verifyEmail); 
router.post("/login", login);
router.get("/profile", protect, getUserProfile);

export default router;
