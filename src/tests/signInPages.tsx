import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SignInPage from "../pages/SignIn";
import { AuthService } from "../services/Auth.service";

// Mock de AuthService
jest.mock("../services/Auth.service", () => ({
  AuthService: {
    signIn: jest.fn(),
  },
}));

describe("SignInPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Affiche correctement les éléments du formulaire", () => {
    render(
      <MemoryRouter>
        <SignInPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Sign In")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByText("Sign in")).toBeInTheDocument();
  });

  test("Affiche un message d'erreur si les champs sont vides", async () => {
    render(
      <MemoryRouter>
        <SignInPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Sign in"));

    await waitFor(() => {
      expect(screen.getByText("Please fix the errors above.")).toBeInTheDocument();
    });
  });

  test("Affiche un message d'erreur si le login échoue", async () => {
    (AuthService.signIn as jest.Mock).mockRejectedValue(new Error("Invalid credentials"));

    render(
      <MemoryRouter>
        <SignInPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "Test1234!" } });

    fireEvent.click(screen.getByText("Sign in"));

    await waitFor(() => {
      expect(screen.getByText("Error logging in. Please try again.")).toBeInTheDocument();
    });
  });

  test("Redirige vers le dashboard après une connexion réussie", async () => {
    const mockNavigate = jest.fn();
    jest.mock("react-router-dom", () => ({
      ...jest.requireActual("react-router-dom"),
      useNavigate: () => mockNavigate,
    }));

    (AuthService.signIn as jest.Mock).mockResolvedValue({ token: "fakeToken" });

    render(
      <MemoryRouter>
        <SignInPage />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "Test1234!" } });

    fireEvent.click(screen.getByText("Sign in"));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });
});
