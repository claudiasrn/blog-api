import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { deleteComment } from "../controllers/commentController.js";

export const commentRouter = Router();

commentRouter.delete("/:id", requireAuth, deleteComment);