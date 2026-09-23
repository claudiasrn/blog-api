import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import Home from "./Home";

vi.mock("../../lib/api", () => ({
	get: vi.fn(),
}));

import { get } from "../../lib/api";

describe("Home", () => {
	it("renders the posts it receives", async () => {
		get.mockResolvedValue({
			posts: [
				{
					id: 1,
					title: "Huelva",
					tags: [],
					createdAt: "2026-09-01T10:00:00.000Z",
				},
				{
					id: 2,
					title: "Frankfurt",
					tags: [],
					createdAt: "2026-09-02T10:00:00.000Z",
				},
			],
			page: 1,
			totalPages: 1,
		});

		render(
			<MemoryRouter>
				<Home />
			</MemoryRouter>,
		);

		expect(await screen.findByText("Huelva")).toBeInTheDocument();
		expect(screen.getByText("Frankfurt")).toBeInTheDocument();
	});

	it("shows a message when there are no posts", async () => {
		get.mockResolvedValue({ posts: [], page: 1, totalPages: 0 });

		render(
			<MemoryRouter>
				<Home />
			</MemoryRouter>,
		);

		expect(await screen.findByText(/no posts yet/i)).toBeInTheDocument();
	});
});
