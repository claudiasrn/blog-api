import { useState } from "react";
import { useAuth } from "../../context/useAuth";
import styles from "./Comment.module.css";

export default function Comment({ comment, onEdit, onDelete }) {
	const { user } = useAuth();
	const [editing, setEditing] = useState(false);
	const [body, setBody] = useState(comment.body);
	const [error, setError] = useState(null);

	const isOwner = user?.id === comment.user.id;

	async function handleSave(event) {
		event.preventDefault();
		setError(null);

		try {
			await onEdit(comment.id, body);
			setEditing(false);
		} catch (err) {
			setError(err.message);
		}
	}

	return (
		<li className={styles.comment}>
			<div className={styles.meta}>
				<span className={styles.author}>{comment.user.username}</span>
				<time dateTime={comment.createdAt} className={styles.date}>
					{new Date(comment.createdAt).toLocaleDateString("de-DE")}
				</time>
			</div>

			{editing ? (
				<form onSubmit={handleSave} className={styles.editForm}>
					{error && <p className={styles.error}>{error}</p>}
					<textarea
						value={body}
						onChange={(event) => setBody(event.target.value)}
						required
					/>
					<div className={styles.editActions}>
						<button type="submit">save</button>
						<button
							type="button"
							onClick={() => {
								setBody(comment.body);
								setEditing(false);
							}}
						>
							cancel
						</button>
					</div>
				</form>
			) : (
				<>
					<p className={styles.body}>{comment.body}</p>
					{isOwner && (
						<div className={styles.actions}>
							<button onClick={() => setEditing(true)}>edit</button>
							<button onClick={() => onDelete(comment.id)}>delete</button>
						</div>
					)}
				</>
			)}
		</li>
	);
}
