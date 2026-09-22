import { prisma } from "../db/prisma.js";
import { body, validationResult } from "express-validator";


export async function getPosts(req, res, next) {
	try {
		const posts = await prisma.post.findMany({
			where: { published: true },
			orderBy: { createdAt: "desc" },
			select: {
				id: true,
				title: true,
				createdAt: true,
				author: { select: { id: true, username: true } },
			},
		});

		res.json(posts);
	} catch (err) {
		next(err);
	}
}

export async function getDrafts(req, res, next) {
	try {
		const posts = await prisma.post.findMany({
			orderBy: { createdAt: "desc" },
			select: {
				id: true,
				title: true,
				published: true,
				createdAt: true,
			},
		});

		res.json(posts);
	} catch (err) {
		next(err);
	}
}

export async function getPost(req, res, next) {
	const id = Number(req.params.id);

	try {
		const post = await prisma.post.findFirst({
			where: { id, published: true },
		});

		if (!post) return res.status(404).json({ message: "Not found" });

		res.json(post);
	} catch (err) {
		next(err);
	}
}

export async function getDraft(req, res, next) {
	const id = Number(req.params.id);

	try {
		const post = await prisma.post.findUnique({ where: { id } });

		if (!post) return res.status(404).json({ message: "Not found" });

		res.json(post);
	} catch (err) {
		next(err);
	}
}

export const validatePost = [
	body("title")
		.trim()
		.notEmpty()
		.withMessage("Title is required")
		.isLength({ max: 255 })
		.withMessage("Title is too long"),

	body("content").trim().notEmpty().withMessage("Content is required"),
];

export async function createPost(req, res, next) {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const { title, content } = req.body;

	try {
		const post = await prisma.post.create({
			data: { title, content, authorId: req.user.id },
		});

		res.status(201).json(post);
	} catch (err) {
		next(err);
	}
}

export async function updatePost(req, res, next) {
	const id = Number(req.params.id);
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const { title, content } = req.body;

	try {
		const result = await prisma.post.updateMany({
			where: { id },
			data: { title, content },
		});

		if (result.count === 0) {
			return res.status(404).json({ message: "Not found" });
		}

		res.json({ message: "Updated" });
	} catch (err) {
		next(err);
	}
}

export async function deletePost(req, res, next) {
	const id = Number(req.params.id);

	try {
		const result = await prisma.post.deleteMany({ where: { id } });

		if (result.count === 0) {
			return res.status(404).json({ message: "Not found" });
		}

		res.status(204).end();
	} catch (err) {
		next(err);
	}
}

export async function togglePublished(req, res, next) {
	const id = Number(req.params.id);

	try {
		const post = await prisma.post.findUnique({ where: { id } });

		if (!post) return res.status(404).json({ message: "Not found" });

		const updated = await prisma.post.update({
			where: { id },
			data: { published: !post.published },
			select: { id: true, published: true },
		});

		res.json(updated);
	} catch (err) {
		next(err);
	}
}