import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import {
  afterEach,
  describe,
  expect,
  test,
  vi,
} from "vitest";

import App from "./App.jsx";
import { AuthContext } from "./AuthContext.jsx";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("App", () => {
  test("renders the navigation", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({
          csrf_token: "test-csrf-token",
        }),
      }),
    );

    render(
      <MemoryRouter>
        <AuthContext.Provider
          value={{
            isAuthenticated: false,
            isAdmin: false,
            login: vi.fn(),
            logout: vi.fn(),
          }}
        >
          <App />
        </AuthContext.Provider>
      </MemoryRouter>,
    );

    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });
});