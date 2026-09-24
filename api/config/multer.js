import multer from "multer";

export const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export const upload = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: MAX_FILE_SIZE },
	fileFilter: (req, file, cb) => {
		cb(null, ALLOWED.includes(file.mimetype));
	},
});