import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { get, put, del } from "../../lib/api";

export default function EditPost() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [title, setTitle] = useState("");
	const [imageUrl, setImageUrl] = useState("");
	const [content, setContent] = useState("");
	const [loaded, setLoaded] = useState(false);
	const [error, setError] = useState(null);
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		get(`/posts/drafts/${id}`)
			.then((post) => {
				setTitle(post.title);
				setImageUrl(post.imageUrl ?? "");
				setContent(post.content);
				setLoaded(true);
			})
			.catch((err) => setError(err.message));
	}, [id]);

	async function handleSubmit(event) {
		event.preventDefault();
		setError(null);
		setSubmitting(true);

		try {
			await put(`/posts/${id}`, { title, content, imageUrl });
			navigate("/");
		} catch (err) {
			setError(err.message);
			setSubmitting(false);
		}
	}

	async function handleDelete() {
		if (!window.confirm("Delete this post and all its comments?")) return;

		try {
			await del(`/posts/${id}`);
			navigate("/");
		} catch (err) {
			setError(err.message);
		}
	}

	if (error && !loaded) return <p>{error}</p>;
	if (!loaded) return <p>Loading…</p>;

	return (
		<>
			<form onSubmit={handleSubmit}>
				<h1>Edit post</h1>

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
					{submitting ? "Saving…" : "Save"}
				</button>
			</form>

			<button onClick={handleDelete}>Delete post</button>
		</>
	);
}
