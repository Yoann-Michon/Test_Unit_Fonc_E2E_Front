import { IBooking } from "../models/Booking.interface";
import { AuthService } from "./Auth.service";

export const bookingService = {
  async getAllBookings() {
    try {
      const token = AuthService.getToken();
      const decodedToken = AuthService.decodeToken();
      const userRole = decodedToken.role;
      if (!userRole) {
        throw new Error("Role not found in token");
      }

      const url =
        userRole === "admin"
          ? `${import.meta.env.VITE_BACK_API_URL}/booking`
          : `${import.meta.env.VITE_BACK_API_URL}/booking/user/${
              decodedToken.sub
            }`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });


      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized: Invalid or expired token");
        } else if (response.status === 403) {
          throw new Error("Forbidden: You can only view your own bookings");
        } else {
          throw new Error("Error fetching bookings");
        }
      }

      const data = await response.json();
      
      return data.data as IBooking[];
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      throw new Error(errorMessage);
    }
  },

  async searchBookings(query: string) {
    try {
      const token = AuthService.getToken();
      if (!token) {
        throw new Error("No token found");
      }

      const decodedToken = AuthService.decodeToken();
      const userRole = decodedToken.role;

      const url =
        userRole === "admin"
          ? `${import.meta.env.VITE_BACK_API_URL}/booking/search/${query}`
          : `${
              import.meta.env.VITE_BACK_API_URL
            }/booking/search/${query}/user/${decodedToken.id}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error searching for bookings");
      }

      const data = await response.json();
      return data.data as IBooking[];
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "An error occurred");
    }
  },

  async createBooking(bookingData: Partial<IBooking>) {
    try {
      const token = AuthService.getToken();
      if (!token) {
        throw new Error("User not authenticated");
      }

      const response = await fetch(
        `${import.meta.env.VITE_BACK_API_URL}/booking`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(bookingData),
        }
      );

      if (!response.ok) {
        throw new Error("Error creating booking");
      }

      const data = await response.json();
      return data.data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "An error occurred");
    }
  },

  async updateBooking(updateData: IBooking) {
    try {
      const token = AuthService.getToken();
      if (!token) {
        throw new Error("User not authenticated");
      }

      const response = await fetch(
        `${import.meta.env.VITE_BACK_API_URL}/booking/${updateData.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!response.ok) {
        throw new Error("Error updating booking");
      }

      const data = await response.json();
      return data.data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "An error occurred");
    }
  },

  async deleteBooking(id: string) {
    try {
      const token = AuthService.getToken();
      if (!token) {
        throw new Error("User not authenticated");
      }

      const decodedToken = AuthService.decodeToken();
      const userRole = decodedToken.role;

      if (userRole !== "admin" && decodedToken.id !== id) {
        throw new Error("You can only delete your own bookings");
      }

      const userBookingUrl = `${
        import.meta.env.VITE_BACK_API_URL
      }/booking/${id}`;
      const response = await fetch(userBookingUrl, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error deleting booking");
      }

      const data = await response.json();
      return data.message;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : "An error occurred");
    }
  },
};
