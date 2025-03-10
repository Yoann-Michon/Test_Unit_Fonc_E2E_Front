import { useEffect, useState } from "react";
import { HotelCards } from "../components/HotelCards";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { hotelService } from "../services/Hotel.service";
import Search from "../components/Search";
import { IHotel } from "../models/Hotel.interface";
import {
  Box,
  Typography,
  CircularProgress,
  Container,
  Divider,
} from "@mui/material";

export const Hotel = () => {
  const [hotels, setHotels] = useState<IHotel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      fetchHotels();
      return;
    }
    searchHotelsService(query);
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

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const hotels = await hotelService.getAllHotels();
      setHotels(hotels);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while fetching hotels"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="end"
        sx={{ mt: 11, width: "100%"}}
      >
        <Search onSearch={handleSearch} searchService={searchHotelsService} />
        <Divider sx={{ width: "100%", my: 2 }} />
      </Box>

      <Container maxWidth="lg" sx={{ py: 4, flexGrow: 1 }}>
        {error && (
          <Typography variant="body1" color="error" align="center" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
            <CircularProgress />
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 4,
            }}
          >
            {hotels.length > 0 ? (
              <HotelCards hotels={hotels} />
            ) : (
              <Typography variant="body1" color="textSecondary" align="center">
                No hotels available
              </Typography>
            )}
          </Box>
        )}
      </Container>
    </Box>
  );
};
