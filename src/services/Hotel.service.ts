import { IHotel } from "../models/Hotel.interface";
import { AuthService } from "./Auth.service";

export const hotelService = {
  async getAllHotels(
    limit = 10,
    sortBy: "name" | "location" = "name",
    order: "ASC" | "DESC" = "ASC"
  ) {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_BACK_API_URL
        }/hotel?limit=${limit}&sortBy=${sortBy}&order=${order}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error fetching hotels: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data as IHotel[];
    } catch (err) {
      throw new Error(
        err instanceof Error
          ? err.message
          : "An error occurred while fetching hotels"
      );
    }
  },

  async searchHotels(query: string) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACK_API_URL}/hotel/search/${query}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error searching for hotels: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data as IHotel[];
    } catch (err) {
      throw new Error(
        err instanceof Error
          ? err.message
          : "An error occurred while searching for hotels"
      );
    }
  },

  async createHotel(hotelData: IHotel, images: File[]) {
    try {
      const token = AuthService.getToken();
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const formData = new FormData();
      formData.append("name", hotelData.name);
      formData.append("location", hotelData.location);
      formData.append("street", hotelData.street);
      formData.append("price", hotelData.price?.toString() || "0");
      formData.append("description", hotelData.description || "");

      images.forEach((image) => {
        formData.append("images", image);
      });

      const response = await fetch(
        `${import.meta.env.VITE_BACK_API_URL}/hotel`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          `Error creating hotel: ${data.message || response.statusText}`
        );
      }

      return data.data;
    } catch (err) {
      throw new Error(
        err instanceof Error
          ? err.message
          : "An error occurred while creating the hotel"
      );
    }
  },

  async updateHotel(id: string, updateData: IHotel, newImages: File[] = []) {
    try {
      const token = AuthService.getToken();
      if (!token) {
        throw new Error("No token found. Please log in.");
      }
      
      const formData = new FormData();
      
      if (updateData.name) formData.append("name", updateData.name);
      if (updateData.street) formData.append("street", updateData.street);
      if (updateData.location) formData.append("location", updateData.location);
      if (updateData.price !== undefined)
        formData.append("price", updateData.price.toString());
      if (updateData.description)
        formData.append("description", updateData.description);
      
      newImages.forEach((image) => formData.append("images", image));
      
      const response = await fetch(
        `${import.meta.env.VITE_BACK_API_URL}/hotel/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      
      if (!response.ok)
        throw new Error(`Error updating hotel: ${response.statusText}`);
      
      const data = await response.json();
      return data.data;
    } catch (err) {
      throw new Error(
        err instanceof Error
          ? err.message
          : "An error occurred while updating the hotel"
      );
    }
  },

  async deleteHotel(id: string) {
    try {
      const token = AuthService.getToken();
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const response = await fetch(
        `${import.meta.env.VITE_BACK_API_URL}/hotel/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error deleting hotel: ${response.statusText}`);
      }

      const data = await response.json();
      return data.message;
    } catch (err) {
      throw new Error(
        err instanceof Error
          ? err.message
          : "An error occurred while deleting the hotel"
      );
    }
  },

  async getHotelById(id: string) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACK_API_URL}/hotel/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error getting hotel: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data;
    } catch (err) {
      throw new Error(
        err instanceof Error
          ? err.message
          : "An error occurred while getting the hotel"
      );
    }
  },
};
