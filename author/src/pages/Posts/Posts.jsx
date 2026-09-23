import { useState, useEffect } from "react";
import { Link } from "react-router";
import { get, put } from "../../lib/api";
import styles from "./Posts.module.css";

export default function Posts() {
	const [posts, setPosts] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		get("/posts/drafts")
			.then(setPosts)
			.catch((err) => setError(err.message));
	}, []);

	async function togglePublished(id) {
		const updated = await put(`/posts/${id}/publish`);
		setPosts((current) =>
			current.map((post) =>
				post.id === id ? { ...post, published: updated.published } : post,
			),
		);
	}

	if (error) return <p className={styles.error}>{error}</p>;
	if (!posts) return <p className={styles.loading}>loading…</p>;
	if (posts.length === 0) return <p className={styles.empty}>no posts yet</p>;

	return (
		<div className={styles.tableWrap}>
			<table className={styles.table}>
				<thead>
					<tr>
						<th>Title</th>
						<th>Date</th>
						<th>Status</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{posts.map((post) => (
						<tr key={post.id}>
							<td>{post.title}</td>
							<td className={styles.date}>
								{new Date(post.createdAt).toLocaleDateString("de-DE")}
							</td>
							<td>
								<span
									className={post.published ? styles.published : styles.draft}
								>
									{post.published ? "published" : "draft"}
								</span>
							</td>
							<td>
								<div className={styles.actions}>
									<button onClick={() => togglePublished(post.id)}>
										{post.published ? "unpublish" : "publish"}
									</button>
									<Link to={`/posts/${post.id}/edit`}>edit</Link>
									<Link to={`/posts/${post.id}/comments`}>comments</Link>
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
