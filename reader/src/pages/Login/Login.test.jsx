import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import Login from "./Login";

vi.mock("../../utils/api", () => ({
	post: vi.fn(),
}));

vi.mock("../../context/useAuth", () => ({
	useAuth: vi.fn(),
}));

import { post } from "../../utils/api";
import { useAuth } from "../../context/useAuth";

describe("Login", () => {
	it("calls login with the token and user on success", async () => {
		const user = userEvent.setup();
		const login = vi.fn();
		useAuth.mockReturnValue({ login });
		post.mockResolvedValue({
			token: "abc123",
			user: { id: 1, username: "claudia" },
		});

		render(
			<MemoryRouter>
				<Login />
			</MemoryRouter>,
		);

		await user.type(screen.getByLabelText(/username/i), "claudia");
		await user.type(screen.getByLabelText(/^password/i), "testpassword");
		await user.click(screen.getByRole("button", { name: /log in/i }));

		expect(post).toHaveBeenCalledWith("/auth/login", {
			username: "claudia",
			password: "testpassword",
		});
		expect(login).toHaveBeenCalledWith("abc123", {
			id: 1,
			username: "claudia",
		});
	});

	it("shows the error message when login fails", async () => {
		const user = userEvent.setup();
		useAuth.mockReturnValue({ login: vi.fn() });
		post.mockRejectedValue(new Error("Incorrect username or password"));

		render(
			<MemoryRouter>
				<Login />
			</MemoryRouter>,
		);

		await user.type(screen.getByLabelText(/username/i), "claudia");
		await user.type(screen.getByLabelText(/^password/i), "wrong");
		await user.click(screen.getByRole("button", { name: /log in/i }));

		expect(
			await screen.findByText("Incorrect username or password"),
		).toBeInTheDocument();
	});
});