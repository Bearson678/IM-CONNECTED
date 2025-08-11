import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import React from "react";
import UserPreferences from "../../Preferences/UserPreferences";
import { AuthContext } from "../../AuthContext";
import i18n from "../../il8n";
const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("../Profile/TextSize", () => ({
  applyTextSize: vi.fn(),
}));

vi.mock("../path/to/i18n", () => ({
  default: {
    changeLanguage: vi.fn(),
    t: (key) => key,
  },
}));

// Mock images to avoid import errors
vi.mock("../assets/Children.png", () => "children.png");
vi.mock("../assets/Depression.png", () => "depression.png");
vi.mock("../assets/Elderly.png", () => "elderly.png");
vi.mock("../assets/Govt.png", () => "govt.png");
vi.mock("../assets/Hospital.png", () => "hospital.png");
vi.mock("../assets/MentalHealth.png", () => "mentalhealth.png");
vi.mock("../assets/Money.png", () => "money.png");
vi.mock("../assets/Wheelchair.png", () => "wheelchair.png");
vi.mock("../config/api", () => ({
  API_ENDPOINTS: {
    USER_PREFERENCES: "/mock/preferences",
  },
}));

const renderWithContext = (ui, { setUser = vi.fn() } = {}) => {
  return render(
    <AuthContext.Provider value={{ setUser }}>{ui}</AuthContext.Provider>
  );
};

describe("UserPreferences Component", () => {
  beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockReset();
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ user: { name: "testUser" } }),
      })
    );
    localStorage.setItem("username", "TestUser");
  });

  it("renders greeting with username", () => {
    renderWithContext(<UserPreferences />);
    expect(screen.getByText(/Hi TestUser!/)).toBeInTheDocument();
  });

  it("changes language when language button clicked", async () => {
    renderWithContext(<UserPreferences />);
    const langBtn = screen.getByRole("button", { name: /English/ });
    fireEvent.click(langBtn);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  it("shows error if Continue clicked without selecting required preferences", () => {
    renderWithContext(<UserPreferences />);
    fireEvent.click(screen.getByText(/Continue/));
    expect(
      screen.getByText(/Please select a preferred language./)
    ).toBeInTheDocument();
  });

  it("submits preferences and navigates on success", async () => {
    renderWithContext(<UserPreferences />);
    fireEvent.click(screen.getByRole("button", { name: /English/ }));
    fireEvent.click(screen.getByRole("button", { name: /Medium/ }));
    fireEvent.click(screen.getByText(/Easy Reader Mode/));
    const topicBtns = screen.getAllByRole("button", {
      name: /Physical Disability/,
    });
    fireEvent.click(topicBtns[0]);

    fireEvent.click(screen.getByText(/Continue/));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/forum");
    });
  });

  it("prevents selecting more than 2 topics", () => {
    renderWithContext(<UserPreferences />);

    const allTopicBtns = screen.getAllByRole("button", {
      name: /Physical Disability|End of Life Care|Mental Disability/,
    });
    fireEvent.click(allTopicBtns[0]);
    fireEvent.click(allTopicBtns[1]);
    expect(allTopicBtns[2]).toHaveClass("disabled");
  });
});
