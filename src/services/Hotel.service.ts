import { IHotel } from "../models/Hotel.interface";
import { AuthService } from "./Auth.service";

export const hotelService = {
  async getAllHotels(
    limit = 10,
    sortBy: 'name' | 'location' = 'name',
    order: 'ASC' | 'DESC' = 'ASC'
  ) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACK_API_URL}/hotel?limit=${limit}&sortBy=${sortBy}&order=${order}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error fetching hotels: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data as IHotel[];
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'An error occurred while fetching hotels');
    }
  },

  async searchHotels(query: string) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACK_API_URL}/hotel/search/${query}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error searching for hotels: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data as IHotel[];
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'An error occurred while searching for hotels');
    }
  },

  async createHotel(hotelData: { name: string; location: string; description?: string; price: number }) {
    try {
      const token = AuthService.getToken();
      if (!token) {
        throw new Error('No token found. Please log in.');
      }

      const response = await fetch(
        `${import.meta.env.VITE_BACK_API_URL}/hotel`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(hotelData),
        }
      );

      if (!response.ok) {
        throw new Error(`Error creating hotel: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'An error occurred while creating the hotel');
    }
  },

  async updateHotel(
    id: string,
    updateData: { name?: string; location?: string; description?: string; price: number }
  ) {
    try {
      const token = AuthService.getToken();
      if (!token) {
        throw new Error('No token found. Please log in.');
      }

      const response = await fetch(
        `${import.meta.env.VITE_BACK_API_URL}/hotel/${id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!response.ok) {
        throw new Error(`Error updating hotel: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'An error occurred while updating the hotel');
    }
  },

  async deleteHotel(id: string) {
    try {
      const token = AuthService.getToken();
      if (!token) {
        throw new Error('No token found. Please log in.');
      }

      const response = await fetch(
        `${import.meta.env.VITE_BACK_API_URL}/hotel/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error deleting hotel: ${response.statusText}`);
      }

      const data = await response.json();
      return data.message;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'An error occurred while deleting the hotel');
    }
  }
};

