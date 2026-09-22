import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { get, post as postRequest } from "../../lib/api";
import { useAuth } from "../../context/useAuth";
import CommentForm from "../../components/CommentForm/CommentForm";

export default function Post() {
	const { id } = useParams();
	const { user } = useAuth();
	const [post, setPost] = useState(null);
	const [comments, setComments] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		get(`/posts/${id}`)
			.then(setPost)
			.catch((err) => setError(err.message));

		get(`/posts/${id}/comments`)
			.then(setComments)
			.catch(() => setComments([]));
	}, [id]);

	async function addComment(body) {
		const comment = await postRequest(`/posts/${id}/comments`, { body });
		setComments((current) => [...current, comment]);
	}

	if (error) return <p>{error}</p>;
	if (!post) return <p>Loading…</p>;

	return (
		<article>
			<h1>{post.title}</h1>
			<time dateTime={post.createdAt}>
				{new Date(post.createdAt).toLocaleDateString()}
			</time>
			<div style={{ whiteSpace: "pre-wrap" }}>{post.content}</div>

			<section>
				<h2>Comments</h2>

				{user ? (
					<CommentForm onSubmit={addComment} />
				) : (
					<p>
						<Link to="/login">Log in</Link> to comment.
					</p>
				)}

				{!comments ? (
					<p>Loading comments…</p>
				) : comments.length === 0 ? (
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
							</li>
						))}
					</ul>
				)}
			</section>
		</article>
	);
}