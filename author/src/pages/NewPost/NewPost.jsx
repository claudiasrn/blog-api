import { useState } from "react";
import { useNavigate } from "react-router";
import { post } from "../../lib/api";

export default function NewPost() {
	const navigate = useNavigate();
	const [title, setTitle] = useState("");
	const [imageUrl, setImageUrl] = useState("");
	const [content, setContent] = useState("");
	const [error, setError] = useState(null);
	const [submitting, setSubmitting] = useState(false);

	async function handleSubmit(event) {
		event.preventDefault();
		setError(null);
		setSubmitting(true);

		try {
			await post("/posts", { title, content, imageUrl });
			navigate("/");
		} catch (err) {
			setError(err.message);
			setSubmitting(false);
		}
	}

	return (
		<form onSubmit={handleSubmit}>
			<h1>New post</h1>

			{error && <p>{error}</p>}

			<label htmlFor="title">Title</label>
			<input
				id="title"
				value={title}
				onChange={(event) => setTitle(event.target.value)}
				required
			/>

			<label htmlFor="imageUrl">Image URL (optional)</label>
			<input
				id="imageUrl"
				type="url"
				value={imageUrl}
				onChange={(event) => setImageUrl(event.target.value)}
			/>

			<label htmlFor="content">Content</label>
			<textarea
				id="content"
				value={content}
				onChange={(event) => setContent(event.target.value)}
				rows={20}
				required
			/>

			<button type="submit" disabled={submitting}>
				{submitting ? "Saving…" : "Save draft"}
			</button>
		</form>
	);
}
