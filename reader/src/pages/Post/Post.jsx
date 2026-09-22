import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { get } from "../../utils/api";

export default function Post() {
	const { id } = useParams();
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