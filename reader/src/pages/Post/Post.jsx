import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { get, post as postRequest, put, del } from "../../lib/api";
import { stars } from "../../lib/stars";
import { useAuth } from "../../context/useAuth";
import CommentForm from "../../components/CommentForm/CommentForm";
import Comment from "../../components/Comment/Comment";
import divider from "../../assets/divider.png";
import styles from "./Post.module.css";

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

	async function editComment(commentId, body) {
		const updated = await put(`/comments/${commentId}`, { body });
		setComments((current) =>
			current.map((c) => (c.id === commentId ? updated : c)),
		);
	}

	async function deleteComment(commentId) {
		await del(`/comments/${commentId}`);
		setComments((current) => current.filter((c) => c.id !== commentId));
	}

	if (error) return <p>{error}</p>;
	if (!post) return <p>Loading…</p>;

	return (
		<>
			<Link to="/" className={styles.back}>
				&lt;&lt; back to the log
			</Link>
			<article className={styles.article}>
				<div className={styles.header}>
					<span>♡ entry {post.id}</span>
					<time dateTime={post.createdAt}>
						{new Date(post.createdAt).toLocaleDateString("de-DE")}
					</time>
				</div>

				<div className={styles.inner}>
					<h1 className={styles.title}>{post.title}</h1>

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

					{post.imageUrl && (
						<img src={post.imageUrl} alt="" className={styles.photo} />
					)}

					<div className={styles.content}>{post.content}</div>

					<img src={divider} alt="" className={styles.divider} />

					<section>
						<h2 className={styles.commentsTitle}>Comments</h2>

						{user ? (
							<CommentForm onSubmit={addComment} />
						) : (
							<p className={styles.loginPrompt}>
								<Link to="/login">Log in</Link> to leave a comment
							</p>
						)}

						{!comments ? (
							<p className={styles.empty}>loading comments…</p>
						) : comments.length === 0 ? (
							<p className={styles.empty}>no comments yet</p>
						) : (
							<ul className={styles.commentList}>
								{comments.map((comment) => (
									<Comment
										key={comment.id}
										comment={comment}
										onEdit={editComment}
										onDelete={deleteComment}
									/>
								))}
							</ul>
						)}
					</section>
				</div>
			</article>
		</>
	);
}
