import { Link } from "react-router";

export default function Navbar() {
	return (
		<header>
			<Link to="/">Umweg</Link>
			<nav>
				<Link to="/login">Log in</Link>
				<Link to="/signup">Sign up</Link>
			</nav>
		</header>
	);
}