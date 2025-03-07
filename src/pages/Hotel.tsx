import { useEffect, useState } from "react";
import { HotelCard } from "../components/Card";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { hotelService } from "../services/Hotel.service";
import { IHotel } from "../models/Hotel.interface";
import { Box, Typography, CircularProgress, Container } from "@mui/material";

export const HotelPage = () => {
  const [hotels, setHotels] = useState<IHotel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    fetchHotels();
  }, []);

  return (
    <>
      <Header />
      <Container sx={{ py: 4, display: "flex", height:"100vh", width:"100%" }}>
        <Typography variant="h4" gutterBottom align="center">
          Hotels
        </Typography>

        {error && (
          <Typography variant="body1" color="error" align="center">
            {error}
          </Typography>
        )}

        {loading && (
          <Box display="flex" justifyContent="center" alignItems="center">
            <CircularProgress />
          </Box>
        )}

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 4,
          }}
        >
          {hotels.length > 0 ? (
            hotels.map((hotel) => (
              <Box key={hotel.id} sx={{ width: "100%", maxWidth: 345 }}>
                <HotelCard hotel={hotel} />
              </Box>
            ))
          ) : (
            <Typography variant="body1" color="textSecondary" align="center" sx={{ width: "100%" }}>
              No hotels available
            </Typography>
          )}
        </Box>
      </Container>
      <Footer />
    </>
  );
};
