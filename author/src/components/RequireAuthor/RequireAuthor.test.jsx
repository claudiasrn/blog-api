import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router";
import RequireAuthor from "./RequireAuthor";

vi.mock("../../context/useAuth", () => ({
	useAuth: vi.fn(),
}));

import { useAuth } from "../../context/useAuth";

function renderGuard() {
	render(
		<MemoryRouter initialEntries={["/"]}>
			<Routes>
				<Route
					path="/"
					element={
						<RequireAuthor>
							<p>Secret dashboard</p>
						</RequireAuthor>
					}
				/>
				<Route path="/login" element={<p>Login page</p>} />
			</Routes>
		</MemoryRouter>,
	);
}

describe("RequireAuthor", () => {
	it("renders the children for an author", () => {
		useAuth.mockReturnValue({
			user: { id: 1, username: "claudia", isAuthor: true },
			loading: false,
		});

		renderGuard();

		expect(screen.getByText("Secret dashboard")).toBeInTheDocument();
	});

	it("redirects to login when there is no user", () => {
		useAuth.mockReturnValue({ user: null, loading: false });

		renderGuard();

		expect(screen.getByText("Login page")).toBeInTheDocument();
		expect(screen.queryByText("Secret dashboard")).toBeNull();
	});

	it("blocks a logged-in non-author", () => {
		useAuth.mockReturnValue({
			user: { id: 2, username: "reader", isAuthor: false },
			loading: false,
		});

		renderGuard();

		expect(screen.getByText(/not authorized/i)).toBeInTheDocument();
		expect(screen.queryByText("Secret dashboard")).toBeNull();
	});

	it("renders nothing while loading", () => {
		useAuth.mockReturnValue({ user: null, loading: true });

		renderGuard();

		expect(screen.queryByText("Secret dashboard")).toBeNull();
		expect(screen.queryByText("Login page")).toBeNull();
	});
});