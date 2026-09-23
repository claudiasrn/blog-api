import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import Posts from "./Posts";

vi.mock("../../lib/api", () => ({
	get: vi.fn(),
	put: vi.fn(),
}));

import { get, put } from "../../lib/api";

const posts = [
	{
		id: 1,
		title: "Huelva",
		published: true,
		createdAt: "2026-09-01T10:00:00.000Z",
	},
	{
		id: 2,
		title: "Frankfurt",
		published: false,
		createdAt: "2026-09-02T10:00:00.000Z",
	},
];

function renderPosts() {
	render(
		<MemoryRouter>
			<Posts />
		</MemoryRouter>,
	);
}

beforeEach(() => {
	vi.clearAllMocks();
});

describe("Posts", () => {
	it("shows the published status of each post", async () => {
		get.mockResolvedValue(posts);

		renderPosts();

		expect(await screen.findByText("Huelva")).toBeInTheDocument();
		expect(screen.getByText("Published")).toBeInTheDocument();
		expect(screen.getByText("Draft")).toBeInTheDocument();
	});

	it("labels the toggle according to the current status", async () => {
		get.mockResolvedValue(posts);

		renderPosts();

		expect(
			await screen.findByRole("button", { name: /unpublish/i }),
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /^publish/i }),
		).toBeInTheDocument();
	});

	it("publishes a draft and updates the row", async () => {
		const user = userEvent.setup();
		get.mockResolvedValue(posts);
		put.mockResolvedValue({ id: 2, published: true });

		renderPosts();

		await user.click(await screen.findByRole("button", { name: /^publish/i }));

		expect(put).toHaveBeenCalledWith("/posts/2/publish");
		expect(
			await screen.findAllByRole("button", { name: /unpublish/i }),
		).toHaveLength(2);
	});
});
