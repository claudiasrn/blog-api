import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { get, del } from "../../lib/api";

export default function PostComments() {
	const { id } = useParams();
	const [post, setPost] = useState(null);
	const [comments, setComments] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		get(`/posts/drafts/${id}`)
			.then(setPost)
			.catch((err) => setError(err.message));

		get(`/posts/${id}/comments`)
			.then(setComments)
			.catch((err) => setError(err.message));
	}, [id]);

	async function handleDelete(commentId) {
		if (!window.confirm("Delete this comment?")) return;

		try {
			await del(`/comments/${commentId}`);
			setComments((current) => current.filter((c) => c.id !== commentId));
		} catch (err) {
			setError(err.message);
		}
	}

	if (error && !comments) return <p>{error}</p>;
	if (!post || !comments) return <p>Loading…</p>;

	return (
		<>
			<h1>Comments on “{post.title}”</h1>
			<Link to="/">Back to posts</Link>

			{error && <p>{error}</p>}

			{comments.length === 0 ? (
				<p>No comments yet.</p>
			) : (
				<ul>
					{comments.map((comment) => (
						<li key={comment.id}>
							<strong>{comment.user.username}</strong>
							<time dateTime={comment.createdAt}>
								{new Date(comment.createdAt).toLocaleDateString()}
							</time>
							<p>{comment.body}</p>
							<button onClick={() => handleDelete(comment.id)}>Delete</button>
						</li>
					))}
				</ul>
			)}
		</>
	);
}
