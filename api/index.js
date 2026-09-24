import express from "express";
import cors from "cors";
import { authRouter } from "./routers/authRouter.js";
import "./config/passport.js";
import { postRouter } from "./routers/postRouter.js";
import { commentRouter } from "./routers/commentRouter.js";
import { uploadRouter } from "./routers/uploadRouter.js";

const app = express();

app.use(
	cors({
		origin: [
			"http://localhost:5173",
			"http://localhost:5174",
			"https://blog-api-reader-claudia.netlify.app",
			"https://blog-api-claudia.netlify.app",
		],
	}),
);
app.use(express.json());

app.use("/auth", authRouter);
app.use("/posts", postRouter);
app.use("/comments", commentRouter);
app.use("/uploads", uploadRouter)

app.use((req, res) => {
	res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
	console.error(err);
	res.status(500).json({ message: "Something went wrong." });
});

app.listen(process.env.PORT || 8080, () => {
	console.log("Server running");
});
