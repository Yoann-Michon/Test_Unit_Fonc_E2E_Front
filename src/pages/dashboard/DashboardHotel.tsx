import { Box, Typography, CircularProgress, Divider, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { IHotel } from "../../models/Hotel.interface";
import { hotelService } from "../../services/Hotel.service";
import { HotelCards } from "../../components/HotelCards";
import { HotelModal } from "../../components/HotelModal";
import { AuthService } from "../../services/Auth.service";
import Search from "../../components/Search";

export const DashboardHotel = () => {
  const [hotels, setHotels] = useState<IHotel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState(false); 
  const [open, setOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<IHotel | null>(null);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const hotels = await hotelService.getAllHotels();
      setHotels(hotels);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while fetching hotels");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      fetchHotels();
    }
  };

  const searchHotelsService = async (query: string) => {
    setLoading(true);
    try {
      const hotelsData = await hotelService.searchHotels(query);
      setHotels(hotelsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while searching hotels");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      await hotelService.deleteHotel(id);
      setHotels(prevHotels => prevHotels.filter(hotel => hotel.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while deleting the hotel");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (hotelId: string) => {
    const hotelToEdit = hotels.find(hotel => hotel.id === hotelId);
    if (hotelToEdit) {
      setSelectedHotel(hotelToEdit);
      setOpen(true);
    }
  };

  const handleCloseModal = () => {
    setSelectedHotel(null);
    setOpen(false);
  };

  const handleSuccess = () => {
    fetchHotels();
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
          <Search onSearch={handleSearch} searchService={searchHotelsService} />
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
                <HotelCards 
                  hotels={hotels} 
                  isAdmin={isAdmin} 
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                  onDashboard={true}
                />
              )}
            </Box>
          )}
        </Box>
        
        {isAdmin && (
          <Button 
            variant="contained" 
            onClick={() => {
              setSelectedHotel(null); 
              setOpen(true);
            }}
          >
            Add Hotel
          </Button>
        )}

        <HotelModal 
          open={open} 
          onClose={handleCloseModal} 
          hotelToEdit={selectedHotel}
          onSuccess={handleSuccess}
        />
      </Box>
    </>
  );
};