import { Router } from "express";
import { validateSignUp, signUp } from "../controllers/authController.js";

export const authRouter = Router();

authRouter.post("/signup", validateSignUp, signUp);