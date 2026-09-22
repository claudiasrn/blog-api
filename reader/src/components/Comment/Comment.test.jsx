import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Comment from "./Comment";

vi.mock("../../context/useAuth", () => ({
	useAuth: vi.fn(),
}));

import { useAuth } from "../../context/useAuth";

const comment = {
	id: 1,
	body: "Nice post",
	createdAt: "2026-09-01T10:00:00.000Z",
	user: { id: 5, username: "reader" },
};

describe("Comment", () => {
	it("shows edit and delete on your own comment", () => {
		useAuth.mockReturnValue({ user: { id: 5, username: "reader" } });

		render(<Comment comment={comment} onEdit={vi.fn()} onDelete={vi.fn()} />);

		expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
	});

	it("hides edit and delete on someone else's comment", () => {
		useAuth.mockReturnValue({ user: { id: 9, username: "other" } });

		render(<Comment comment={comment} onEdit={vi.fn()} onDelete={vi.fn()} />);

		expect(screen.queryByRole("button", { name: /edit/i })).toBeNull();
		expect(screen.queryByRole("button", { name: /delete/i })).toBeNull();
	});

	it("hides edit and delete when logged out", () => {
		useAuth.mockReturnValue({ user: null });

		render(<Comment comment={comment} onEdit={vi.fn()} onDelete={vi.fn()} />);

		expect(screen.queryByRole("button", { name: /edit/i })).toBeNull();
	});

	it("calls onDelete with the comment id", async () => {
		const user = userEvent.setup();
		const onDelete = vi.fn();
		useAuth.mockReturnValue({ user: { id: 5, username: "reader" } });

		render(<Comment comment={comment} onEdit={vi.fn()} onDelete={onDelete} />);

		await user.click(screen.getByRole("button", { name: /delete/i }));

		expect(onDelete).toHaveBeenCalledWith(1);
	});
});