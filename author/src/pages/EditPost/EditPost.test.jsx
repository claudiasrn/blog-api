import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router";
import EditPost from "./EditPost";

vi.mock("../../lib/api", () => ({
	get: vi.fn(),
	put: vi.fn(),
	del: vi.fn(),
}));

import { get, put, del } from "../../lib/api";

function renderEditPost() {
	render(
		<MemoryRouter initialEntries={["/posts/1/edit"]}>
			<Routes>
				<Route path="/posts/:id/edit" element={<EditPost />} />
			</Routes>
		</MemoryRouter>,
	);
}

beforeEach(() => {
	vi.clearAllMocks();
	get.mockResolvedValue({
		id: 1,
		title: "Huelva",
		content: "A week by the sea.",
		published: false,
		tags: [],
		createdAt: "2026-09-01T10:00:00.000Z",
	});
});

describe("EditPost", () => {
	it("prefills the form with the existing post", async () => {
		renderEditPost();

		expect(await screen.findByLabelText(/title/i)).toHaveValue("Huelva");
		expect(screen.getByLabelText(/content/i)).toHaveValue("A week by the sea.");
	});

	it("saves the edited values", async () => {
		const user = userEvent.setup();
		put.mockResolvedValue({});

		renderEditPost();

		const title = await screen.findByLabelText(/title/i);
		await user.clear(title);
		await user.type(title, "Huelva revisited");
		await user.click(screen.getByRole("button", { name: /^save/i }));

		expect(put).toHaveBeenCalledWith("/posts/1", {
			title: "Huelva revisited",
			content: "A week by the sea.",
			imageUrl: "",
			rating: "",
			tags: [],
		});
	});

	it("does not delete when the confirmation is dismissed", async () => {
		const user = userEvent.setup();
		vi.spyOn(window, "confirm").mockReturnValue(false);

		renderEditPost();

		await user.click(await screen.findByRole("button", { name: /delete/i }));

		expect(del).not.toHaveBeenCalled();
	});

	it("deletes when confirmed", async () => {
		const user = userEvent.setup();
		vi.spyOn(window, "confirm").mockReturnValue(true);

		renderEditPost();

		await user.click(await screen.findByRole("button", { name: /delete/i }));

		expect(del).toHaveBeenCalledWith("/posts/1");
	});
});
