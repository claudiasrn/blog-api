import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { post } from "../../lib/api";
import { useAuth } from "../../context/useAuth";

export default function Signup() {
	const { login } = useAuth();
	const navigate = useNavigate();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState(null);
	const [submitting, setSubmitting] = useState(false);

	async function handleSubmit(event) {
		event.preventDefault();
		setError(null);

		if (password !== confirmPassword) {
			return setError("Passwords do not match");
		}

		setSubmitting(true);

		try {
			await post("/auth/signup", { username, password });
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
			<h1>Sign up</h1>

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

			<label htmlFor="confirmPassword">Confirm password</label>
			<input
				id="confirmPassword"
				type="password"
				value={confirmPassword}
				onChange={(event) => setConfirmPassword(event.target.value)}
				required
			/>

			<button type="submit" disabled={submitting}>
				{submitting ? "Creating account…" : "Sign up"}
			</button>

			<p>
				Already have an account? <Link to="/login">Log in</Link>
			</p>
		</form>
	);
}
