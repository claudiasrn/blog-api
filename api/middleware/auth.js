import passport from "passport";

export const requireAuth = passport.authenticate("jwt", { session: false });

export function requireAuthor(req, res, next) {
	if (!req.user.isAuthor) {
		return res.status(403).json({ message: "Forbidden" });
	}
	next();
}