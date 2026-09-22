import { Router } from "express";
import { validateSignUp, signUp, logIn } from "../controllers/authController.js";

export const authRouter = Router();

authRouter.post("/signup", validateSignUp, signUp);
authRouter.post("/login", logIn);