import { useState } from "react";

export default function CommentForm({ onSubmit }) {
	const [body, setBody] = useState("");
	const [error, setError] = useState(null);
	const [submitting, setSubmitting] = useState(false);

	async function handleSubmit(event) {
		event.preventDefault();
		setError(null);
		setSubmitting(true);

		try {
			await onSubmit(body);
			setBody("");
		} catch (err) {
			setError(err.message);
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<form onSubmit={handleSubmit}>
			{error && <p>{error}</p>}
			<label htmlFor="body">Leave a comment</label>
			<textarea
				id="body"
				value={body}
				onChange={(event) => setBody(event.target.value)}
				required
			/>
			<button type="submit" disabled={submitting}>
				{submitting ? "Posting…" : "Post comment"}
			</button>
		</form>
	);
}