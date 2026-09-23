import { Outlet } from "react-router";
import Navbar from "./components/Navbar/Navbar";
import styles from "./App.module.css";

export default function App() {
	return (
		<div className={styles.layout}>
			<Navbar />
			<main className={styles.main}>
				<Outlet />
			</main>
		</div>
	);
}
