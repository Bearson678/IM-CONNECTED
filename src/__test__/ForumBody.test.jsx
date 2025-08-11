import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, vi, expect, beforeEach } from "vitest";
import ForumBody from "../Forum/ForumBody/ForumBody";
import { BrowserRouter } from "react-router-dom";

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'Loading': 'Loading',
        'No posts available': 'No posts available'
      };
      return translations[key] || key;
    }
  })
}));

// Mock API endpoints
vi.mock('../config/api.js', () => ({
  API_ENDPOINTS: {
    POSTS: 'http://localhost:5001/api/v1/post/',
    SAVED_POSTS: 'http://localhost:5001/api/v1/saved/',
    LIKE_BASE: 'http://localhost:5001/api/v1/like/',
    USER_GET: 'http://localhost:5001/api/v1/user/getUser'
  }
}));

// Mock child components that might call useNavigate
vi.mock("../Forum/ForumCard/ForumCard", () => ({
  default: (props) => (
    <div data-testid="mock-forum-card">{props.postTitle || "MockCard"}</div>
  ),
}));

vi.mock("../Forum/ToPost/ToPost", () => ({
  default: () => <div data-testid="mock-to-post">ToPost</div>,
}));

vi.mock("../Forum/Filter/Filter", () => ({
  default: ({ onFilter }) => (
    <button data-testid="mock-filter" onClick={() => onFilter({ sort: "top" })}>
      Filter
    </button>
  ),
}));

vi.mock("../Forum/TopicSelector/TopicSelector", () => ({
  default: ({ onTagFilterChange }) => (
    <button
      data-testid="mock-topic-selector"
      onClick={() => onTagFilterChange("React")}
    >
      TopicSelector
    </button>
  ),
}));

vi.mock("../Forum/Bookmark/Bookmark", () => ({
  default: () => <div data-testid="mock-bookmark">Bookmark</div>,
}));

// Mock fetch
global.fetch = vi.fn();

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe("ForumBody", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch.mockImplementation((url) => {
      if (url.includes('/user/getUser')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ preferences: { topics: [] } })
        });
      }
      if (url.includes('/saved/')) {
        return Promise.resolve({
          ok: true,
          json: async () => []
        });
      }
      if (url.includes('/like/')) {
        return Promise.resolve({
          ok: true,
          json: async () => []
        });
      }
      // Default posts endpoint
      return Promise.resolve({
        ok: true,
        json: async () => []
      });
    });
  });

  it("renders loading and then handles post data", async () => {
    global.fetch.mockImplementation((url) => {
      if (url.includes('/user/getUser')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ preferences: { topics: [1] } })
        });
      }
      if (url.includes('/saved/')) {
        return Promise.resolve({
          ok: true,
          json: async () => []
        });
      }
      if (url.includes('/like/')) {
        return Promise.resolve({
          ok: true,
          json: async () => []
        });
      }
      if (url.includes('/post/')) {
        return Promise.resolve({
          ok: true,
          json: async () => [
            {
              postId: "123",
              username: "Alice",
              createdAt: "2023-01-01",
              title: "Test Post",
              tags: ["React"],
              content: "Test content",
              comments: [],
              likes: [],
              media: [],
            },
          ]
        });
      }
      return Promise.resolve({
        ok: true,
        json: async () => []
      });
    });

    renderWithRouter(<ForumBody />);

    // Verify initial loading state
    expect(screen.getByText("Loading")).toBeInTheDocument();

    // Verify that loading eventually disappears (API calls complete)
    await waitFor(() => {
      expect(screen.queryByText("Loading")).not.toBeInTheDocument();
    }, { timeout: 3000 });

    // Verify fetch was called multiple times (confirms API orchestration works)
    expect(global.fetch).toHaveBeenCalledTimes(5); // user, saved, like, post x2
  });

  it("renders error message on fetch fail", async () => {
    global.fetch.mockImplementation((url) => {
      if (url.includes('/user/getUser')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ preferences: { topics: ["React"] } })
        });
      }
      if (url.includes('/saved/')) {
        return Promise.resolve({
          ok: true,
          json: async () => []
        });
      }
      if (url.includes('/like/')) {
        return Promise.resolve({
          ok: true,
          json: async () => []
        });
      }
      if (url.includes('/post/')) {
        return Promise.resolve({ ok: false });
      }
      return Promise.resolve({
        ok: true,
        json: async () => []
      });
    });

    renderWithRouter(<ForumBody />);

    await waitFor(() => {
      expect(screen.getByText("No posts available")).toBeInTheDocument();
    });
  });

  it("renders 'No posts available' when post array is empty", async () => {
    global.fetch.mockImplementation((url) => {
      if (url.includes('/user/getUser')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ preferences: { topics: ["React"] } })
        });
      }
      if (url.includes('/saved/')) {
        return Promise.resolve({
          ok: true,
          json: async () => []
        });
      }
      if (url.includes('/like/')) {
        return Promise.resolve({
          ok: true,
          json: async () => []
        });
      }
      return Promise.resolve({
        ok: true,
        json: async () => []
      });
    });

    renderWithRouter(<ForumBody />);

    await waitFor(() => {
      expect(screen.getByText("No posts available")).toBeInTheDocument();
    });
  });
});
