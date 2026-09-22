import { Router } from "express";
import {
	getPosts,
	getDrafts,
	getPost,
	getDraft,
	createPost,
	deletePost,
	validatePost,
	updatePost,
	togglePublished,
} from "../controllers/postController.js";
import {
	getComments,
	createComment,
    validateComment
} from "../controllers/commentController.js";
import { requireAuth, requireAuthor } from "../middleware/auth.js";

export const postRouter = Router();

postRouter.get("/", getPosts);
postRouter.post("/", requireAuth, requireAuthor, validatePost, createPost);
postRouter.get("/drafts", requireAuth, requireAuthor, getDrafts);
postRouter.get("/drafts/:id", requireAuth, requireAuthor, getDraft);
postRouter.get("/:id", getPost);
postRouter.put("/:id", requireAuth, requireAuthor, validatePost, updatePost);
postRouter.delete("/:id", requireAuth, requireAuthor, deletePost);
postRouter.put("/:id/publish", requireAuth, requireAuthor, togglePublished);

postRouter.get("/:postId/comments", getComments);
postRouter.post(
	"/:postId/comments",
	requireAuth,
	validateComment,
	createComment,
);
