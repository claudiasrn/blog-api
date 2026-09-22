import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { get } from "../../utils/api";

export default function Post() {
	const { id } = useParams();
	const [post, setPost] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		get(`/posts/${id}`)
			.then(setPost)
			.catch((err) => setError(err.message));
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
		</article>
	);
}