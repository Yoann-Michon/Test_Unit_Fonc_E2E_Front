import { Box, Typography, Divider, CircularProgress, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper } from "@mui/material";
import Search from "../../components/Search";
import { useState, useEffect } from "react";
import { bookingService } from "../../services/Booking.service";
import type { IBooking } from "../../models/Booking.interface";

const Bookings = () => {
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const fetchBookings = async () => {
    setLoading(true);
    setError(null); // Reset error state before fetching
    
    try {
      const bookingsData = await bookingService.getAllBookings();
      setBookings(bookingsData ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while fetching bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      fetchBookings();
      return;
    }
  };

  const searchBookingsService = async (query: string) => {
    setLoading(true);
    try {
      const bookingsData = await bookingService.searchBookings(query);
      setBookings(bookingsData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while searching bookings"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
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
            Bookings
          </Typography>
          <Search 
            onSearch={handleSearch} 
            searchService={searchBookingsService} 
            placeholder="Search booking…" 
          />
        </Box>
        <Divider sx={{ width: "100%" }} />
        
        <Box sx={{ padding: 2, width: "100%" }}>
          {loading && <CircularProgress sx={{ display: "block", margin: "0 auto" }} />}
          {error && (
            <Typography variant="body1" color="error">
              {error}
            </Typography>
          )}
          {!loading && !error && (
            <>
              {bookings && bookings.length === 0? (
                <Typography variant="body1">No bookings found</Typography>
              ) : (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Booking ID</TableCell>
                        <TableCell>User</TableCell>
                        <TableCell>Hotel</TableCell>
                        <TableCell>Check-in Date</TableCell>
                        <TableCell>Check-out Date</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {bookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell>{booking.id}</TableCell>
                          <TableCell>{booking.user.lastname}</TableCell> 
                          <TableCell>{booking.user.firstname}</TableCell> 
                          <TableCell>{booking.hotel.name}</TableCell> 
                          <TableCell>{new Date(booking.checkInDate).toLocaleDateString()}</TableCell>
                          <TableCell>{new Date(booking.checkOutDate).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </>
          )}
        </Box>
      </Box>
    </>
  );
};

export default Bookings;
