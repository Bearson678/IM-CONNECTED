

import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import Bookmark from "../Forum/Bookmark/Bookmark";

// Mock API endpoints
vi.mock("../config/api.js", () => ({
  API_ENDPOINTS: {
    SAVED_POST_ACTION: (postId, action) =>
      `http://localhost:5001/api/v1/saved/${encodeURIComponent(postId)}/${action}`,
  },
}));

// Mock asset imports
vi.mock("../assets/Bookmark.png", () => ({ default: "mock-bookmark-filled.png" }));
vi.mock("../assets/Unbookmark.png", () => ({ default: "mock-bookmark-empty.png" }));

// Mock global fetch
global.fetch = vi.fn();

describe("Bookmark component", () => {
  const postId = "post123";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders with unbookmarked icon initially", () => {
    render(<Bookmark postId={postId} initialBookmarked={false} />);
    const img = screen.getByAltText("bookmark");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "mock-bookmark-empty.png");
  });

  it("renders with bookmarked icon initially", () => {
    render(<Bookmark postId={postId} initialBookmarked={true} />);
    const img = screen.getByAltText("bookmark");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "mock-bookmark-filled.png");
  });

  it("clicking unbookmarked icon triggers save API call", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      text: async () => "ok",
    });

    render(<Bookmark postId={postId} initialBookmarked={false} />);
    const img = screen.getByAltText("bookmark");
    await userEvent.click(img);

    expect(fetch).toHaveBeenCalledWith(
      `http://localhost:5001/api/v1/saved/${encodeURIComponent(postId)}/save`,
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })
    );
  });

  it("clicking bookmarked icon triggers delete API call", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      text: async () => "ok",
    });

    render(<Bookmark postId={postId} initialBookmarked={true} />);
    const img = screen.getByAltText("bookmark");
    await userEvent.click(img);

    expect(fetch).toHaveBeenCalledWith(
      `http://localhost:5001/api/v1/saved/${encodeURIComponent(postId)}/delete`,
      expect.objectContaining({
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })
    );
  });

  it("toggles bookmark state after successful API call", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      text: async () => "ok",
    });

    render(<Bookmark postId={postId} initialBookmarked={false} />);
    const img = screen.getByAltText("bookmark");
    
    // Initially unbookmarked
    expect(img).toHaveAttribute("src", "mock-bookmark-empty.png");
    
    await userEvent.click(img);
    
    // Should become bookmarked
    expect(img).toHaveAttribute("src", "mock-bookmark-filled.png");
  });

  it("handles fetch error gracefully", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      text: async () => "error message",
    });

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(<Bookmark postId={postId} initialBookmarked={false} />);
    const img = screen.getByAltText("bookmark");
    await userEvent.click(img);

    expect(consoleSpy).toHaveBeenCalledWith(
      "Error updating bookmark:",
      "error message"
    );

    consoleSpy.mockRestore();
  });

  it("stops event propagation when clicked", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      text: async () => "ok",
    });

    const parentClickHandler = vi.fn();
    
    render(
      <div onClick={parentClickHandler}>
        <Bookmark postId={postId} initialBookmarked={false} />
      </div>
    );
    
    const img = screen.getByAltText("bookmark");
    await userEvent.click(img);

    // Parent click should not be triggered due to stopPropagation
    expect(parentClickHandler).not.toHaveBeenCalled();
  });

  it("applies cursor pointer style", () => {
    render(<Bookmark postId={postId} initialBookmarked={false} />);
    const img = screen.getByAltText("bookmark");
    expect(img).toHaveStyle({ cursor: "pointer" });
  });

  it("handles API rejection error", async () => {
    fetch.mockRejectedValueOnce(new Error("Network error"));

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(<Bookmark postId={postId} initialBookmarked={false} />);
    const img = screen.getByAltText("bookmark");
    await userEvent.click(img);

    expect(consoleSpy).toHaveBeenCalledWith(
      "Error updating bookmark:",
      "Network error"
    );

    consoleSpy.mockRestore();
  });
});
