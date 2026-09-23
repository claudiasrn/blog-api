import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router";
import PostComments from "./PostComments";

vi.mock("../../lib/api", () => ({
	get: vi.fn(),
	del: vi.fn(),
}));

import { get, del } from "../../lib/api";

function renderPostComments() {
	render(
		<MemoryRouter initialEntries={["/posts/1/comments"]}>
			<Routes>
				<Route path="/posts/:id/comments" element={<PostComments />} />
			</Routes>
		</MemoryRouter>,
	);
}

beforeEach(() => {
	vi.clearAllMocks();

	get.mockImplementation((path) =>
		path.endsWith("/comments")
			? Promise.resolve([
					{
						id: 1,
						body: "Nice post",
						createdAt: "2026-09-01T10:00:00.000Z",
						user: { id: 5, username: "reader" },
					},
					{
						id: 2,
						body: "Spam link",
						createdAt: "2026-09-02T10:00:00.000Z",
						user: { id: 6, username: "spammer" },
					},
				])
			: Promise.resolve({
					id: 1,
					title: "Huelva",
					content: "A week by the sea.",
					published: true,
					createdAt: "2026-09-01T10:00:00.000Z",
				}),
	);
});

describe("PostComments", () => {
	it("lists the comments with their authors", async () => {
		renderPostComments();

		expect(await screen.findByText("Nice post")).toBeInTheDocument();
		expect(screen.getByText("reader")).toBeInTheDocument();
		expect(screen.getByText("Spam link")).toBeInTheDocument();
		expect(screen.getByText("spammer")).toBeInTheDocument();
	});

	it("removes a comment from the list after deleting it", async () => {
		const user = userEvent.setup();
		vi.spyOn(window, "confirm").mockReturnValue(true);
		del.mockResolvedValue(null);

		renderPostComments();

		await screen.findByText("Spam link");
		const buttons = screen.getAllByRole("button", { name: /delete/i });
		await user.click(buttons[1]);

		expect(del).toHaveBeenCalledWith("/comments/2");
		expect(screen.queryByText("Spam link")).toBeNull();
		expect(screen.getByText("Nice post")).toBeInTheDocument();
	});

	it("does not delete when the confirmation is dismissed", async () => {
		const user = userEvent.setup();
		vi.spyOn(window, "confirm").mockReturnValue(false);

		renderPostComments();

		await screen.findByText("Nice post");
		await user.click(screen.getAllByRole("button", { name: /delete/i })[0]);

		expect(del).not.toHaveBeenCalled();
		expect(screen.getByText("Nice post")).toBeInTheDocument();
	});
});
