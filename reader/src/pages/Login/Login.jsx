import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { post } from "../../lib/api";
import { useAuth } from "../../context/useAuth";

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
		<form onSubmit={handleSubmit}>
			<h1>Log in</h1>

			{error && <p>{error}</p>}

			<label htmlFor="username">Username</label>
			<input
				id="username"
				value={username}
				onChange={(event) => setUsername(event.target.value)}
				required
			/>

			<label htmlFor="password">Password</label>
			<input
				id="password"
				type="password"
				value={password}
				onChange={(event) => setPassword(event.target.value)}
				required
			/>

			<button type="submit" disabled={submitting}>
				{submitting ? "Logging in…" : "Log in"}
			</button>

			<p>
				No account? <Link to="/signup">Sign up</Link>
			</p>
		</form>
	);
}
