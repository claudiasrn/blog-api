import { supabase } from "../db/supabase.js";

export async function uploadImage(req, res, next) {
	if (!req.file) {
		return res.status(400).json({ message: "No image provided" });
	}

	const extension = req.file.originalname.split(".").pop().toLowerCase();
	const key = `${crypto.randomUUID()}.${extension}`;

	try {
		const { error } = await supabase.storage
			.from("post-images")
			.upload(key, req.file.buffer, { contentType: req.file.mimetype });

		if (error) return next(error);

		const { data } = supabase.storage.from("post-images").getPublicUrl(key);

		res.status(201).json({ url: data.publicUrl });
	} catch (err) {
		next(err);
	}
}