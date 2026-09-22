import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import { prisma } from "../db/prisma.js";
import jwt from "jsonwebtoken";

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

export async function logIn(req, res, next) {
	const { username, password } = req.body;

	try {
		const user = await prisma.user.findUnique({
			where: { username: username.toLowerCase() },
		});

		if (!user) {
			return res.status(401).json({ message: "Incorrect username or password" });
		}

		const match = await bcrypt.compare(password, user.password);

		if (!match) {
			return res.status(401).json({ message: "Incorrect username or password" });
		}

		const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
			expiresIn: "1h",
		});

		res.json({ token });
	} catch (err) {
		return next(err);
	}
}

export function getMe(req, res) {
	res.json(req.user);
}