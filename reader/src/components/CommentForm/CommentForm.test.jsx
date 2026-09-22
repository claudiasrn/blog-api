import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CommentForm from "./CommentForm";

describe("CommentForm", () => {
	it("calls onSubmit with the typed comment", async () => {
		const user = userEvent.setup();
		const onSubmit = vi.fn().mockResolvedValue();

		render(<CommentForm onSubmit={onSubmit} />);

		await user.type(screen.getByLabelText(/leave a comment/i), "Nice post");
		await user.click(screen.getByRole("button", { name: /post comment/i }));

		expect(onSubmit).toHaveBeenCalledWith("Nice post");
	});

	it("clears the textarea after a successful submit", async () => {
		const user = userEvent.setup();
		const onSubmit = vi.fn().mockResolvedValue();

		render(<CommentForm onSubmit={onSubmit} />);

		const textarea = screen.getByLabelText(/leave a comment/i);
		await user.type(textarea, "Nice post");
		await user.click(screen.getByRole("button", { name: /post comment/i }));

		expect(textarea).toHaveValue("");
	});

	it("shows an error and keeps the text when submit fails", async () => {
		const user = userEvent.setup();
		const onSubmit = vi.fn().mockRejectedValue(new Error("Comment too long"));

		render(<CommentForm onSubmit={onSubmit} />);

		const textarea = screen.getByLabelText(/leave a comment/i);
		await user.type(textarea, "Nice post");
		await user.click(screen.getByRole("button", { name: /post comment/i }));

		expect(screen.getByText("Comment too long")).toBeInTheDocument();
		expect(textarea).toHaveValue("Nice post");
	});
});