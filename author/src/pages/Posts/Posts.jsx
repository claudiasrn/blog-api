import { useState, useEffect } from "react";
import { Link } from "react-router";
import { get } from "../../lib/api";

export default function Posts() {
	const [posts, setPosts] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		get("/posts/drafts")
			.then(setPosts)
			.catch((err) => setError(err.message));
	}, []);

	if (error) return <p>{error}</p>;
	if (!posts) return <p>Loading…</p>;
	if (posts.length === 0) return <p>No posts yet.</p>;

	return (
		<table>
			<thead>
				<tr>
					<th>Title</th>
					<th>Date</th>
					<th>Status</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{posts.map((post) => (
					<tr key={post.id}>
						<td>{post.title}</td>
						<td>{new Date(post.createdAt).toLocaleDateString()}</td>
						<td>{post.published ? "Published" : "Draft"}</td>
						<td>
							<Link to={`/posts/${post.id}/edit`}>Edit</Link>
							<Link to={`/posts/${post.id}/comments`}>Comments</Link>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}