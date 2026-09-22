import { useState, useEffect } from "react";
import { Link } from "react-router";
import { get } from "../../lib/api";

export default function Home() {
	const [data, setData] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		get("/posts")
			.then(setData)
			.catch((err) => setError(err.message));
	}, []);

	if (error) return <p>{error}</p>;
	if (!data) return <p>Loading…</p>;
	if (data.posts.length === 0) return <p>No posts yet.</p>;

	return (
		<ul>
			{data.posts.map((post) => (
				<li key={post.id}>
					<Link to={`/posts/${post.id}`}>
						<h2>{post.title}</h2>
						<time dateTime={post.createdAt}>
							{new Date(post.createdAt).toLocaleDateString()}
						</time>
					</Link>
				</li>
			))}
		</ul>
	);
}
