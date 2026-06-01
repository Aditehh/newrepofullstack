import express from "express";
import { registerUser, loginUser, refreshAccessToken } from "../controllers/auth.controller";
// import { authLimiter } from "../middleware/rateLimit.middleware";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshAccessToken);

export default router;
