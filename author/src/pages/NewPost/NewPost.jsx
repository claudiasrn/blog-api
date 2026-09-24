import { useState } from "react";
import { useNavigate } from "react-router";
import { post, uploadFile } from "../../lib/api";
import styles from "../../styles/form.module.css";

export default function NewPost() {
	const navigate = useNavigate();
	const [title, setTitle] = useState("");
	const [imageUrl, setImageUrl] = useState("");
	const [rating, setRating] = useState("");
	const [tags, setTags] = useState("");
	const [content, setContent] = useState("");
	const [error, setError] = useState(null);
	const [submitting, setSubmitting] = useState(false);
	const [uploading, setUploading] = useState(false);
	const [uploadError, setUploadError] = useState(null);

	async function handleFileChange(event) {
		const file = event.target.files[0];
		if (!file) return;

		setUploadError(null);
		setUploading(true);

		try {
			const data = await uploadFile("/uploads", file);
			setImageUrl(data.url);
		} catch (err) {
			setUploadError(err.message);
		} finally {
			setUploading(false);
		}
	}

	async function handleSubmit(event) {
		event.preventDefault();
		setError(null);
		setSubmitting(true);

		try {
			await post("/posts", {
				title,
				content,
				imageUrl,
				rating,
				tags: tags
					.split(",")
					.map((tag) => tag.trim().toLowerCase())
					.filter(Boolean),
			});
			navigate("/");
		} catch (err) {
			setError(err.message);
			setSubmitting(false);
		}
	}

	return (
		<form onSubmit={handleSubmit} className={styles.form}>
			<h1 className={styles.title}>New post</h1>

			{error && <p className={styles.error}>{error}</p>}

			<label htmlFor="title" className={styles.label}>
				Title
			</label>
			<input
				id="title"
				value={title}
				onChange={(event) => setTitle(event.target.value)}
				required
			/>

			<label htmlFor="image" className={styles.label}>
				Image
			</label>
			<input
				id="image"
				type="file"
				accept="image/*"
				onChange={handleFileChange}
				disabled={uploading}
			/>

			{uploading && <p className={styles.hint}>uploading…</p>}
			{uploadError && <p className={styles.error}>{uploadError}</p>}

			{imageUrl && (
				<>
					<img src={imageUrl} alt="" className={styles.preview} />
					<button
						type="button"
						onClick={() => setImageUrl("")}
						className={styles.removeImage}
					>
						remove image
					</button>
				</>
			)}

			<label htmlFor="imageUrl" className={styles.label}>
				Image URL
			</label>
			<input
				id="imageUrl"
				value={imageUrl}
				onChange={(event) => setImageUrl(event.target.value)}
			/>

			<label htmlFor="rating" className={styles.label}>
				Rating (1–5, optional)
			</label>
			<input
				id="rating"
				type="number"
				min="1"
				max="5"
				value={rating}
				onChange={(event) => setRating(event.target.value)}
			/>

			<label htmlFor="tags" className={styles.label}>
				Tags (comma separated)
			</label>
			<input
				id="tags"
				value={tags}
				onChange={(event) => setTags(event.target.value)}
				placeholder="taunus, day hike"
			/>

			<label htmlFor="content" className={styles.label}>
				Content
			</label>
			<textarea
				id="content"
				value={content}
				onChange={(event) => setContent(event.target.value)}
				rows={20}
				required
			/>

			<button type="submit" disabled={submitting} className={styles.submit}>
				{submitting ? "saving…" : "save draft"}
			</button>
		</form>
	);
}
