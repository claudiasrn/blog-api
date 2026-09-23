import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import NewPost from "./NewPost";

vi.mock("../../lib/api", () => ({
	post: vi.fn(),
}));

import { post } from "../../lib/api";

function renderNewPost() {
	render(
		<MemoryRouter>
			<NewPost />
		</MemoryRouter>,
	);
}

beforeEach(() => {
	vi.clearAllMocks();
});

describe("NewPost", () => {
	it("submits the title and content", async () => {
		const user = userEvent.setup();
		post.mockResolvedValue({ id: 1 });

		renderNewPost();

		await user.type(screen.getByLabelText(/title/i), "Huelva");
		await user.type(screen.getByLabelText(/content/i), "A week by the sea.");
		await user.click(screen.getByRole("button", { name: /save/i }));

		expect(post).toHaveBeenCalledWith("/posts", {
			title: "Huelva",
			content: "A week by the sea.",
			imageUrl: "",
		});
	});

	it("shows an error and keeps the text when saving fails", async () => {
		const user = userEvent.setup();
		post.mockRejectedValue(new Error("Title is too long"));

		renderNewPost();

		const title = screen.getByLabelText(/title/i);
		await user.type(title, "Huelva");
		await user.type(screen.getByLabelText(/content/i), "A week by the sea.");
		await user.click(screen.getByRole("button", { name: /save/i }));

		expect(await screen.findByText("Title is too long")).toBeInTheDocument();
		expect(title).toHaveValue("Huelva");
	});
});
