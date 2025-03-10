import { IUser } from "../models/User.interface";

export const AuthService = {
  async signUp(user: IUser): Promise<IUser> {
    const response = await fetch(
      `${import.meta.env.VITE_BACK_API_URL}/auth/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      }
    );

    if (!response.ok) throw new Error("Error during sign up");

    return await response.json();
  },

  async signIn(email: string, password: string): Promise<IUser> {
    const response = await fetch(
      `${import.meta.env.VITE_BACK_API_URL}/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );

    if (!response.ok) throw new Error("Incorrect email or password");

    const data = await response.json();

    localStorage.setItem("token", data.token);
    return data;
  },

  getToken() {
    return localStorage.getItem("token");
  },

  logout() {
    localStorage.removeItem("token");
  },

  decodeToken() {
    try {
      const token = this.getToken();
      if (!token) return null;
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      throw new Error("Invalid token");
    }
  },

  getUserRole() {
    const decoded = this.decodeToken();
    return decoded?.role || null;
  },

  isAdmin() {
    return this.getUserRole() === "admin";
  },

  getUserInfo() {
    const decoded = this.decodeToken();
    if (!decoded) return null;
    return {
      id: decoded.sub, 
      firstname: decoded.firstname,
      lastname: decoded.lastname,
      fullName: decoded.firstname && decoded.lastname 
        ? `${decoded.firstname} ${decoded.lastname}` 
        : null
    };
  },
  

  isTokenExpired() {
    const token = this.getToken();
    if (!token) return true; 
  
    const decoded = this.decodeToken();
    const currentTime = Date.now() / 1000;
    const exp = decoded?.exp < currentTime
    if (exp){this.logout()}
    return exp ;
  }
};
