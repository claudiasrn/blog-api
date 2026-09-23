import { Link } from "react-router";
import { useAuth } from "../../context/useAuth";

export default function Navbar() {
	const { user, logout } = useAuth();

	return (
		<header>
			<Link to="/">Umweg Admin</Link>
			{user && (
				<nav>
					<Link to="/">Posts</Link>
					<Link to="/posts/new">New post</Link>
					<button onClick={logout}>Log out</button>
				</nav>
			)}
		</header>
	);
}