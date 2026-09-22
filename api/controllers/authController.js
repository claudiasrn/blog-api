import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import { prisma } from "../db/prisma.js";

export const validateSignUp = [
	body("username")
		.trim()
		.toLowerCase()
		.notEmpty()
		.withMessage("Username is required")
		.isLength({ max: 255 })
		.withMessage("Username is too long"),

	body("password")
		.isLength({ min: 8 })
		.withMessage("Password must be at least 8 characters"),
];

export async function signUp(req, res, next) {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const { username, password } = req.body;

	try {
		const hashedPassword = await bcrypt.hash(password, 10);

		const user = await prisma.user.create({
			data: { username, password: hashedPassword },
			omit: { password: true },
		});

		res.status(201).json(user);
	} catch (err) {
		if (err.code === "P2002") {
			return res
				.status(400)
				.json({ errors: [{ msg: "A user with this username already exists" }] });
		}
		return next(err);
	}
}