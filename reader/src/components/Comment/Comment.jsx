import { useState } from "react";
import { useAuth } from "../../context/useAuth";

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
		<li>
			<strong>{comment.user.username}</strong>
			<time dateTime={comment.createdAt}>
				{new Date(comment.createdAt).toLocaleDateString()}
			</time>

			{editing ? (
				<form onSubmit={handleSave}>
					{error && <p>{error}</p>}
					<textarea
						value={body}
						onChange={(event) => setBody(event.target.value)}
						required
					/>
					<button type="submit">Save</button>
					<button
						type="button"
						onClick={() => {
							setBody(comment.body);
							setEditing(false);
						}}
					>
						Cancel
					</button>
				</form>
			) : (
				<>
					<p>{comment.body}</p>
					{isOwner && (
						<>
							<button onClick={() => setEditing(true)}>Edit</button>
							<button onClick={() => onDelete(comment.id)}>Delete</button>
						</>
					)}
				</>
			)}
		</li>
	);
}