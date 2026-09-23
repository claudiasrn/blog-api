import { Link } from "react-router";
import styles from "./NotFound.module.css";

export default function NotFound() {
	return (
		<div className={styles.wrapper}>
			<h1 className={styles.title}>Not found</h1>
			<p className={styles.text}>404 — no such page</p>
			<Link to="/">back to posts</Link>
		</div>
	);
}
