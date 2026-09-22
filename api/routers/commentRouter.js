import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
	deleteComment,
	validateComment,
	updateComment,
} from "../controllers/commentController.js";

export const commentRouter = Router();

commentRouter.delete("/:id", requireAuth, deleteComment);
commentRouter.put("/:id", requireAuth, validateComment, updateComment);
