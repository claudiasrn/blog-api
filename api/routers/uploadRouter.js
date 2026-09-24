import { Router } from "express";
import { requireAuth, requireAuthor } from "../middleware/auth.js";
import { upload } from "../config/multer.js";
import { uploadImage } from "../controllers/uploadController.js";

export const uploadRouter = Router();

uploadRouter.post("/", requireAuth, requireAuthor, upload.single("image"), uploadImage);