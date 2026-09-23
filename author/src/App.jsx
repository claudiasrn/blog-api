import { Outlet } from "react-router";
import Navbar from "./components/Navbar/Navbar";

export default function App() {
	return (
		<div>
			<Navbar />
			<main>
				<Outlet />
			</main>
		</div>
	);
}
