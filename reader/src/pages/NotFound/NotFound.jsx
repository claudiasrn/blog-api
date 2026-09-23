import { Link } from "react-router";
import styles from "./NotFound.module.css";

export default function NotFound() {
	return (
		<div className={styles.wrapper}>
			<h1 className={styles.title}>Lost the trail</h1>
			<p className={styles.text}>404 — this page doesn&apos;t exist</p>
			<Link to="/">back to the log</Link>
		</div>
	);
}
