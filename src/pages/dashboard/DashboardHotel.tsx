// src/pages/Hotel.tsx
import { Box, Typography, CircularProgress, Divider } from "@mui/material";
import Search from "../../components/Search";
import { useEffect, useState } from "react";
import type { IHotel  } from "../../models/Hotel.interface";
import { hotelService } from "../../services/Hotel.service";
import { HotelCard } from "../../components/Card";
import { HotelModal } from "../../components/HotelModal";
import { AuthService } from "../../services/Auth.service";

export const DashboardHotel = () => {
  const [hotels, setHotels] = useState<IHotel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState(false); 

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const hotels = await hotelService.getAllHotels();
      setHotels(hotels);
      setLoading(false);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while fetching hotels"
      );
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      fetchHotels();
      return;
    }
  };

  const searchHotelsService = async (query: string) => {
    setLoading(true);
    try {
      const hotelsData = await hotelService.searchHotels(query);
      setHotels(hotelsData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while searching hotels"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
    setIsAdmin(AuthService.isAdmin());
  }, []);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          textAlign: "center",
          height: "100vh",
          width: "100%",
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 2,
          }}
        >
          <Typography variant="h4" component="h1">
            Hotels
          </Typography>
          <Search 
            onSearch={handleSearch} 
            searchService={searchHotelsService} 
            placeholder="Search hotels…" 
          />
        </Box>
        <Divider sx={{ width: "100%" }} />
        <Box>
          {loading && <CircularProgress />}
          {error && (
            <Typography variant="body1" color="error">
              {error}
            </Typography>
          )}
          {!loading && !error && (
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 2,
                padding: 2,
                overflow: "auto",
              }}
            >
              {hotels.length === 0 ? (
                <Typography variant="body1">No hotels found</Typography>
              ) : (
                hotels.map((hotel) => (
                  <HotelCard key={hotel.id} hotel={hotel} />
                ))
              )}
            </Box>
          )}
        </Box>
      </Box>
      <HotelModal isAdmin={isAdmin} />
    </>
  );
};