import { Link } from "react-router";
import { useAuth } from "../../context/useAuth";

export default function Navbar() {
	const { user, loading, logout } = useAuth();

	return (
		<header>
			<Link to="/">Umweg</Link>
			<nav>
				{loading ? null : user ? (
					<>
						<span>{user.username}</span>
						<button onClick={logout}>Log out</button>
					</>
				) : (
					<>
						<Link to="/login">Log in</Link>
						<Link to="/signup">Sign up</Link>
					</>
				)}
			</nav>
		</header>
	);
}
