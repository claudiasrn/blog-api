import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import { get } from "../../lib/api";
import { stars } from "../../lib/stars";
import styles from "./Home.module.css";

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
			<ul className={styles.list}>
				{data.posts.map((post) => (
					<li key={post.id} className={styles.entry}>
						<div className={styles.entryHeader}>
							<span>♡ entry {post.id}</span>
							<span>
								{new Date(post.createdAt).toLocaleDateString("de-DE")}
							</span>
						</div>

						<Link to={`/posts/${post.id}`} className={styles.entryLink}>
							{post.imageUrl ? (
								<div className={styles.thumbWrap}>
									<img src={post.imageUrl} alt="" className={styles.thumb} />
								</div>
							) : (
								<div className={styles.thumbEmpty} />
							)}

							<div className={styles.body}>
								<h2 className={styles.title}>{post.title}</h2>
								{post.rating != null && (
									<p className={styles.stars}>{stars(post.rating)}</p>
								)}
								{post.tags.length > 0 && (
									<ul className={styles.tags}>
										{post.tags.map((tag) => (
											<li key={tag} className={styles.tag}>
												{tag}
											</li>
										))}
									</ul>
								)}
							</div>
						</Link>
					</li>
				))}
			</ul>

			<div className={styles.pagination}>
				<button
					onClick={() => setSearchParams({ page: page - 1 })}
					disabled={page <= 1}
				>
					&lt;&lt; prev
				</button>
				<span>
					page {data.page} / {data.totalPages}
				</span>
				<button
					onClick={() => setSearchParams({ page: page + 1 })}
					disabled={page >= data.totalPages}
				>
					next &gt;&gt;
				</button>
			</div>
		</>
	);
}
