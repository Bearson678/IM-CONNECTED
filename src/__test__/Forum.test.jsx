import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import Forum from "../Forum/Forum/Forum";

// Mock Header component
vi.mock("../TopHeader/Header/Header", () => ({
  default: () => <div data-testid="mock-header">Mock Header</div>,
}));

// Mock ForumBody component
vi.mock("../Forum/ForumBody/ForumBody", () => ({
  default: () => <div data-testid="mock-forum-body">Mock ForumBody</div>,
}));

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe("Forum component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders Header and ForumBody components", () => {
    renderWithRouter(<Forum />);

    expect(screen.getByTestId("mock-header")).toBeInTheDocument();
    expect(screen.getByTestId("mock-forum-body")).toBeInTheDocument();
  });

  it("renders components in correct order", () => {
    const { container } = renderWithRouter(<Forum />);

    const mainDiv = container.firstChild;
    const header = screen.getByTestId("mock-header");
    const forumBody = screen.getByTestId("mock-forum-body");

    // Check that both components are direct children of the main div
    expect(header.parentElement).toBe(mainDiv);
    expect(forumBody.parentElement).toBe(mainDiv);

    // Check that header comes before forum body
    const children = Array.from(mainDiv.children);
    const headerIndex = children.indexOf(header);
    const forumBodyIndex = children.indexOf(forumBody);
    
    expect(headerIndex).toBeLessThan(forumBodyIndex);
  });

  it("has correct component structure", () => {
    const { container } = renderWithRouter(<Forum />);

    // Should have a main div container
    expect(container.firstChild.tagName).toBe("DIV");
    
    // Should contain exactly 2 child components
    expect(container.firstChild.children).toHaveLength(2);
  });

  it("handles component mounting and unmounting", () => {
    const { unmount } = renderWithRouter(<Forum />);

    expect(screen.getByTestId("mock-header")).toBeInTheDocument();
    expect(screen.getByTestId("mock-forum-body")).toBeInTheDocument();

    // Should not throw when unmounting
    expect(() => unmount()).not.toThrow();
  });

  it("renders without additional props", () => {
    renderWithRouter(<Forum />);
    
    expect(screen.getByTestId("mock-header")).toBeInTheDocument();
    expect(screen.getByTestId("mock-forum-body")).toBeInTheDocument();
  });

  it("should maintain component structure across re-renders", () => {
    const { rerender } = renderWithRouter(<Forum />);
    
    expect(screen.getByTestId("mock-header")).toBeInTheDocument();
    expect(screen.getByTestId("mock-forum-body")).toBeInTheDocument();
    
    // Re-render
    rerender(
      <BrowserRouter>
        <Forum />
      </BrowserRouter>
    );
    
    expect(screen.getByTestId("mock-header")).toBeInTheDocument();
    expect(screen.getByTestId("mock-forum-body")).toBeInTheDocument();
  });
});
