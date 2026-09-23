import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { get, del } from "../../lib/api";
import styles from "./PostComments.module.css";

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
			<Link to="/" className={styles.back}>
				&lt;&lt; back to posts
			</Link>

			<h1 className={styles.title}>Comments on “{post.title}”</h1>

			{error && <p className={styles.error}>{error}</p>}

			{comments.length === 0 ? (
				<p className={styles.empty}>no comments yet</p>
			) : (
				<ul className={styles.list}>
					{comments.map((comment) => (
						<li key={comment.id} className={styles.comment}>
							<div>
								<div className={styles.meta}>
									<span>{comment.user.username}</span>
									<time dateTime={comment.createdAt} className={styles.date}>
										{new Date(comment.createdAt).toLocaleDateString("de-DE")}
									</time>
								</div>
								<p className={styles.body}>{comment.body}</p>
							</div>
							<button
								onClick={() => handleDelete(comment.id)}
								className={styles.delete}
							>
								delete
							</button>
						</li>
					))}
				</ul>
			)}
		</>
	);
}
