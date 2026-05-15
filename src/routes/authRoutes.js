import express from "express";
import { registerUser, loginUser, getUserProfile, updateUserProfile, refreshToken, invalidateToken } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshToken);
router.post("/invalidate", protect, invalidateToken);
router.get("/profile", protect, getUserProfile);
router.patch("/profile", protect, updateUserProfile);
router.put("/profile", protect, updateUserProfile);
router.post("/profile", protect, updateUserProfile);

export default router;
