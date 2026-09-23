import { Link } from "react-router";
import { useAuth } from "../../context/useAuth";
import styles from "./Navbar.module.css";

export default function Navbar() {
	const { user, logout } = useAuth();

	return (
		<header className={styles.header}>
			<Link to="/" className={styles.wordmark}>
				umweg <span className={styles.label}>admin</span>
			</Link>

			{user && (
				<nav className={styles.nav}>
					<Link to="/">posts</Link>
					<Link to="/posts/new">new post</Link>
					<button onClick={logout} className={styles.logout}>
						log out
					</button>
				</nav>
			)}
		</header>
	);
}
