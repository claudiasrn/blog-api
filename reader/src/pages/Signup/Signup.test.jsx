import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import Signup from "./Signup";

vi.mock("../../lib/api", () => ({
	post: vi.fn(),
}));

vi.mock("../../context/useAuth", () => ({
	useAuth: vi.fn(),
}));

import { post } from "../../lib/api";
import { useAuth } from "../../context/useAuth";

function renderSignup() {
	render(
		<MemoryRouter>
			<Signup />
		</MemoryRouter>,
	);
}

async function fillForm(user, { password, confirmPassword }) {
	await user.type(screen.getByLabelText(/username/i), "claudia");
	await user.type(screen.getByLabelText(/^password/i), password);
	await user.type(screen.getByLabelText(/confirm password/i), confirmPassword);
	await user.click(screen.getByRole("button", { name: /sign up/i }));
}

describe("Signup", () => {
	it("rejects mismatched passwords without calling the API", async () => {
		const user = userEvent.setup();
		useAuth.mockReturnValue({ login: vi.fn() });

		renderSignup();
		await fillForm(user, {
			password: "testpassword",
			confirmPassword: "different",
		});

		expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
		expect(post).not.toHaveBeenCalled();
	});

	it("signs up then logs in on success", async () => {
		const user = userEvent.setup();
		const login = vi.fn();
		useAuth.mockReturnValue({ login });

		post
			.mockResolvedValueOnce({ id: 1, username: "claudia" })
			.mockResolvedValueOnce({
				token: "abc123",
				user: { id: 1, username: "claudia" },
			});

		renderSignup();
		await fillForm(user, {
			password: "testpassword",
			confirmPassword: "testpassword",
		});

		expect(post).toHaveBeenCalledWith("/auth/signup", {
			username: "claudia",
			password: "testpassword",
		});
		expect(post).toHaveBeenCalledWith("/auth/login", {
			username: "claudia",
			password: "testpassword",
		});
		expect(login).toHaveBeenCalledWith("abc123", {
			id: 1,
			username: "claudia",
		});
	});
});