import { Router } from "express";
import {
	validateSignUp,
	signUp,
	logIn,
	getMe,
} from "../controllers/authController.js";

import { requireAuth } from "../middleware/auth.js";

export const authRouter = Router();

authRouter.post("/signup", validateSignUp, signUp);
authRouter.post("/login", logIn);
authRouter.get("/me", requireAuth, getMe);
