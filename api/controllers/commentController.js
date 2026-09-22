import { prisma } from "../db/prisma.js";
import { body, validationResult } from "express-validator";

export async function getComments(req, res, next) {
	const postId = Number(req.params.postId);

	try {
		const post = await prisma.post.findFirst({
			where: { id: postId, published: true },
		});

		if (!post) return res.status(404).json({ message: "Not found" });

		const comments = await prisma.comment.findMany({
			where: { postId },
			orderBy: { createdAt: "asc" },
			select: {
				id: true,
				body: true,
				createdAt: true,
				user: { select: { id: true, username: true } },
			},
		});

		res.json(comments);
	} catch (err) {
		next(err);
	}
}

export const validateComment = [
	body("body")
		.trim()
		.notEmpty()
		.withMessage("Comment cannot be empty")
		.isLength({ max: 1000 })
		.withMessage("Comment is too long"),
];

export async function createComment(req, res, next) {
	const postId = Number(req.params.postId);
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	try {
		const post = await prisma.post.findFirst({
			where: { id: postId, published: true },
		});

		if (!post) return res.status(404).json({ message: "Not found" });

		const comment = await prisma.comment.create({
			data: { body: req.body.body, postId, userId: req.user.id },
			select: {
				id: true,
				body: true,
				createdAt: true,
				user: { select: { id: true, username: true } },
			},
		});

		res.status(201).json(comment);
	} catch (err) {
		next(err);
	}
}

export async function deleteComment(req, res, next) {
	const id = Number(req.params.id);

	try {
		const comment = await prisma.comment.findUnique({ where: { id } });

		if (!comment) return res.status(404).json({ message: "Not found" });

		if (comment.userId !== req.user.id && !req.user.isAuthor) {
			return res.status(403).json({ message: "Forbidden" });
		}

		await prisma.comment.delete({ where: { id } });

		res.status(204).end();
	} catch (err) {
		next(err);
	}
}

export async function updateComment(req, res, next) {
	const id = Number(req.params.id);
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	try {
		const comment = await prisma.comment.findUnique({ where: { id } });

		if (!comment) return res.status(404).json({ message: "Not found" });

		if (comment.userId !== req.user.id && !req.user.isAuthor) {
			return res.status(403).json({ message: "Forbidden" });
		}

		const updated = await prisma.comment.update({
			where: { id },
			data: { body: req.body.body },
			select: {
				id: true,
				body: true,
				createdAt: true,
				user: { select: { id: true, username: true } },
			},
		});

		res.json(updated);
	} catch (err) {
		next(err);
	}
}