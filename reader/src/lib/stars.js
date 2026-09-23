export function stars(rating) {
	return "★".repeat(rating) + "☆".repeat(5 - rating);
}