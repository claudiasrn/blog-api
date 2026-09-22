import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router";
import Post from "./Post";

vi.mock("../../utils/api", () => ({
	get: vi.fn(),
	post: vi.fn(),
	put: vi.fn(),
	del: vi.fn(),
}));

vi.mock("../../context/useAuth", () => ({
	useAuth: vi.fn(),
}));

import { get } from "../../utils/api";
import { useAuth } from "../../context/useAuth";

function renderPost() {
	render(
		<MemoryRouter initialEntries={["/posts/1"]}>
			<Routes>
				<Route path="/posts/:id" element={<Post />} />
			</Routes>
		</MemoryRouter>,
	);
}

beforeEach(() => {
	vi.clearAllMocks();
	useAuth.mockReturnValue({ user: null });
});

describe("Post", () => {
	it("renders the post and its comments", async () => {
		get.mockImplementation((path) =>
			path.endsWith("/comments")
				? Promise.resolve([
						{
							id: 1,
							body: "Nice post",
							createdAt: "2026-09-01T10:00:00.000Z",
							user: { id: 5, username: "reader" },
						},
					])
				: Promise.resolve({
						id: 1,
						title: "Huelva",
						content: "A week by the sea.",
						createdAt: "2026-09-01T10:00:00.000Z",
					}),
		);

		renderPost();

		expect(await screen.findByText("Huelva")).toBeInTheDocument();
		expect(screen.getByText("A week by the sea.")).toBeInTheDocument();
		expect(await screen.findByText("Nice post")).toBeInTheDocument();
	});

	it("shows an error when the post is not found", async () => {
		get.mockRejectedValue(new Error("Not found"));

		renderPost();

		expect(await screen.findByText("Not found")).toBeInTheDocument();
	});

	it("prompts logged-out visitors to log in instead of showing the form", async () => {
		get.mockImplementation((path) =>
			path.endsWith("/comments")
				? Promise.resolve([])
				: Promise.resolve({
						id: 1,
						title: "Huelva",
						content: "A week by the sea.",
						createdAt: "2026-09-01T10:00:00.000Z",
					}),
		);

		renderPost();

		expect(await screen.findByText(/log in/i)).toBeInTheDocument();
		expect(screen.queryByLabelText(/leave a comment/i)).toBeNull();
	});
});