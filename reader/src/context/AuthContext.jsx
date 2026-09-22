import { useState, useEffect } from "react";
import { get } from "../utils/api";
import { AuthContext } from "./context";

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(() =>
		Boolean(localStorage.getItem("token")),
	);

	useEffect(() => {
		if (!localStorage.getItem("token")) return;

		get("/auth/me")
			.then(setUser)
			.catch(() => localStorage.removeItem("token"))
			.finally(() => setLoading(false));
	}, []);

	function login(token, user) {
		localStorage.setItem("token", token);
		setUser(user);
	}

	function logout() {
		localStorage.removeItem("token");
		setUser(null);
	}

	return (
		<AuthContext.Provider value={{ user, loading, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
}