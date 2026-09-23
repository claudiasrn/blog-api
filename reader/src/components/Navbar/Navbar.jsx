import { Link } from "react-router";
import { useAuth } from "../../context/useAuth";
import styles from "./Navbar.module.css";

export default function Navbar() {
	const { user, loading, logout } = useAuth();

	return (
		<>
			<header className={styles.header}>
				<Link to="/" className={styles.wordmark}>
					·°· umweg ·°·
				</Link>
				<p className={styles.tagline}>my little trail diary ♡</p>
			</header>

			<div className={styles.bar}>
				<span className={styles.barLabel}>trail log</span>
				{loading ? null : user ? (
					<span className={styles.userBlock}>
						{user.username}
						<button onClick={logout} className={styles.logout}>
							log out
						</button>
					</span>
				) : (
					<span>
						<Link to="/login">[ log in ]</Link>{" "}
						<Link to="/signup">[ sign up ]</Link>
					</span>
				)}
			</div>
		</>
	);
}
