import express from "express";
import cors from "cors";
import { authRouter } from "./routers/authRouter.js";

const app = express();

app.use(cors({ origin: ["http://localhost:5173", "http://localhost:5174"] }));
app.use(express.json());

app.use("/auth", authRouter);

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
