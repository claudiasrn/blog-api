import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import Navbar from "./Navbar";

vi.mock("../../context/useAuth", () => ({
	useAuth: vi.fn(),
}));

import { useAuth } from "../../context/useAuth";

function renderNavbar() {
	render(
		<MemoryRouter>
			<Navbar />
		</MemoryRouter>,
	);
}

describe("Navbar", () => {
	it("shows login and signup links when logged out", () => {
		useAuth.mockReturnValue({ user: null, loading: false, logout: vi.fn() });

		renderNavbar();

		expect(screen.getByRole("link", { name: /log in/i })).toBeInTheDocument();
		expect(screen.getByRole("link", { name: /sign up/i })).toBeInTheDocument();
	});

	it("shows the username and a logout button when logged in", () => {
		useAuth.mockReturnValue({
			user: { id: 1, username: "claudia" },
			loading: false,
			logout: vi.fn(),
		});

		renderNavbar();

		expect(screen.getByText("claudia")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /log out/i })).toBeInTheDocument();
		expect(screen.queryByRole("link", { name: /log in/i })).toBeNull();
	});

	it("shows neither while loading", () => {
		useAuth.mockReturnValue({ user: null, loading: true, logout: vi.fn() });

		renderNavbar();

		expect(screen.queryByRole("link", { name: /log in/i })).toBeNull();
		expect(screen.queryByRole("button", { name: /log out/i })).toBeNull();
	});

	it("calls logout when the button is clicked", async () => {
		const user = userEvent.setup();
		const logout = vi.fn();
		useAuth.mockReturnValue({
			user: { id: 1, username: "claudia" },
			loading: false,
			logout,
		});

		renderNavbar();

		await user.click(screen.getByRole("button", { name: /log out/i }));

		expect(logout).toHaveBeenCalled();
	});
});