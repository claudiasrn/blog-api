import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { post } from "../../lib/api";
import { useAuth } from "../../context/useAuth";
import styles from "./Login.module.css";

export default function Login() {
	const { login } = useAuth();
	const navigate = useNavigate();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(null);
	const [submitting, setSubmitting] = useState(false);

	async function handleSubmit(event) {
		event.preventDefault();
		setError(null);
		setSubmitting(true);

		try {
			const data = await post("/auth/login", { username, password });
			login(data.token, data.user);
			navigate("/");
		} catch (err) {
			setError(err.message);
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<form onSubmit={handleSubmit} className={styles.form}>
			<h1 className={styles.title}>Log in</h1>

			{error && <p className={styles.error}>{error}</p>}

			<label htmlFor="username" className={styles.label}>
				Username
			</label>
			<input
				id="username"
				value={username}
				onChange={(event) => setUsername(event.target.value)}
				required
			/>

			<label htmlFor="password" className={styles.label}>
				Password
			</label>
			<input
				id="password"
				type="password"
				value={password}
				onChange={(event) => setPassword(event.target.value)}
				required
			/>

			<button type="submit" disabled={submitting} className={styles.submit}>
				{submitting ? "logging in…" : "log in"}
			</button>

			<p className={styles.alt}>
				no account? <Link to="/signup">sign up</Link>
			</p>
		</form>
	);
}
