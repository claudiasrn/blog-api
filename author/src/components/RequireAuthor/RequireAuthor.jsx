import { Navigate } from "react-router";
import { useAuth } from "../../context/useAuth";

export default function RequireAuthor({ children }) {
	const { user, loading } = useAuth();

	if (loading) return null;
	if (!user) return <Navigate to="/login" replace />;
	if (!user.isAuthor) return <p>You are not authorized to view this page.</p>;

	return children;
}