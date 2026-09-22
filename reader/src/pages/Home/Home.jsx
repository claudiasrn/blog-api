import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import { get } from "../../lib/api";

export default function Home() {
	const [data, setData] = useState(null);
	const [error, setError] = useState(null);
	const [searchParams, setSearchParams] = useSearchParams();

	const page = Number(searchParams.get("page")) || 1;

	useEffect(() => {
		get(`/posts?page=${page}`)
			.then(setData)
			.catch((err) => setError(err.message));
	}, [page]);

	if (error) return <p>{error}</p>;
	if (!data) return <p>Loading…</p>;
	if (data.posts.length === 0) return <p>No posts yet.</p>;

	return (
		<>
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

			<div>
				<button
					onClick={() => setSearchParams({ page: page - 1 })}
					disabled={page <= 1}
				>
					Previous
				</button>
				<span>
					Page {data.page} of {data.totalPages}
				</span>
				<button
					onClick={() => setSearchParams({ page: page + 1 })}
					disabled={page >= data.totalPages}
				>
					Next
				</button>
			</div>
		</>
	);
}
