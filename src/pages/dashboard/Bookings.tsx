import {
  Box,
  Typography,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { bookingService } from "../../services/Booking.service";
import { AuthService } from "../../services/Auth.service";
import type { IBooking } from "../../models/Booking.interface";

const Bookings = () => {
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingBooking, setEditingBooking] = useState<IBooking | null>(null);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<IBooking | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  useEffect(() => {
    const checkPermissions = () => setIsAdmin(AuthService.isAdmin());

    const fetchData = async () => {
      try {
        checkPermissions();
        const bookingsData = await bookingService.getAllBookings();
        setBookings(bookingsData ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error loading data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEditBooking = (booking: IBooking) => {
    setEditingBooking(booking);
    setCheckInDate(formatDateForInput(new Date(booking.checkInDate)));
    setCheckOutDate(formatDateForInput(new Date(booking.checkOutDate)));
    setOpenDialog(true);
  };

  const formatDateForInput = (date: Date) => date.toISOString().split("T")[0];

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingBooking(null);
  };

  const handleSaveChanges = async () => {
    if (!editingBooking) return;

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkIn < today) {
      showSnackbar("Check-in date cannot be in the past", "error");
      return;
    }

    if (checkOut <= checkIn) {
      showSnackbar("Check-out date must be after check-in date", "error");
      return;
    }

    try {
      setLoading(true);
      const updatedBooking: IBooking = {
        ...editingBooking,
        checkInDate: checkIn,
        checkOutDate: checkOut,
      };
      const result = await bookingService.updateBooking(updatedBooking);

      setBookings(bookings.map((b) => (b.id === result.id ? result : b)));

      handleCloseDialog();
      showSnackbar("Booking updated successfully", "success");
    } catch (err) {
      showSnackbar(
        err instanceof Error ? err.message : "Error updating booking",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBooking = async () => {
    if (!bookingToDelete) return;

    try {
      setLoading(true);
      if (bookingToDelete.id) {
        await bookingService.deleteBooking(bookingToDelete.id);
      } else {
        throw new Error("Booking ID is undefined");
      }
      setBookings(bookings.filter((b) => b.id !== bookingToDelete.id));

      setDeleteDialogOpen(false);
      showSnackbar("Booking deleted successfully", "success");
    } catch (err) {
      showSnackbar(
        err instanceof Error ? err.message : "Error deleting booking",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => setSnackbarOpen(false);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 3,
        display: "flex",
        flexDirection: "column",
        textAlign: "center",
        height: "100vh",
        width: "100%",
        justifyContent: "flex-start",
        alignItems: "center",
      }}
    >
      <Typography variant="h4" gutterBottom alignSelf="start">
        {isAdmin ? "Bookings" : "My Bookings"}
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Hotel</TableCell>
              <TableCell>Check In</TableCell>
              <TableCell>Check Out</TableCell>
              <TableCell>Price</TableCell>
              {isAdmin && <TableCell>Client</TableCell>}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.hotel?.name}</TableCell>
                <TableCell>
                  {new Date(booking.checkInDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(booking.checkOutDate).toLocaleDateString()}
                </TableCell>
                <TableCell> €</TableCell>
                {isAdmin && (
                  <TableCell>
                    {booking.user?.firstname} {booking.user?.lastname}
                  </TableCell>
                )}
                <TableCell>
                  <IconButton
                    onClick={() => handleEditBooking(booking)}
                    color="primary"
                  >
                    <Edit />
                  </IconButton>
                  {isAdmin && (
                    <IconButton
                      onClick={() => {
                        setBookingToDelete(booking);
                        setDeleteDialogOpen(true);
                      }}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {bookings.length === 0 && (
        <Typography sx={{ mt: 2 }}>No bookings found</Typography>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Edit Booking</DialogTitle>
        <DialogContent>
          <TextField
            label="Check-in Date"
            type="date"
            value={checkInDate}
            onChange={(e) => setCheckInDate(e.target.value)}
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Check-out Date"
            type="date"
            value={checkOutDate}
            onChange={(e) => setCheckOutDate(e.target.value)}
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <IconButton onClick={handleCloseDialog}>Cancel</IconButton>
          <IconButton onClick={handleSaveChanges}>Save</IconButton>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this booking?
        </DialogContent>
        <DialogActions>
          <IconButton onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </IconButton>
          <IconButton onClick={handleDeleteBooking}>Delete</IconButton>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert severity={snackbarSeverity}>{snackbarMessage}</Alert>
      </Snackbar>
    </Box>
  );
};

export default Bookings;
