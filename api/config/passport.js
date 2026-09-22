import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { prisma } from "../db/prisma.js";

const strategy = new JwtStrategy(
	{
		jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
		secretOrKey: process.env.JWT_SECRET,
	},
	async (payload, done) => {
		try {
			const user = await prisma.user.findUnique({
				where: { id: payload.id },
				omit: { password: true },
			});

			if (!user) return done(null, false);

			return done(null, user);
		} catch (err) {
			return done(err);
		}
	},
);

passport.use(strategy);