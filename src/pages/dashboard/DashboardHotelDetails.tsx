import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  styled,
  Typography,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { hotelService } from "../../services/Hotel.service";
import { IHotel } from "../../models/Hotel.interface";
import { useParams, useNavigate } from "react-router-dom";
import { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Carousel } from "../../components/Carousel";
import { bookingService } from "../../services/Booking.service";
import {SlideSnackbar} from "../../components/SlideSnackbar";
import dayjs from "dayjs";

const ImageContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  "&:hover": {
    "& .MuiImageListItem-root": {
      transform: "scale(1.05)",
      transition: "transform 0.3s ease-in-out",
    },
  },
  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
}));

export const DashboardHotelDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState<IHotel | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [checkIn, setCheckIn] = useState<Dayjs | null>(null);
  const [checkOut, setCheckOut] = useState<Dayjs | null>(null);

  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("info");

  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        setLoading(true);
        if (id) {
          const hotelData = await hotelService.getHotelById(id);
          setHotel(hotelData);
        } else {
          setError("Invalid hotel ID");
        }
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch hotel details");
        setLoading(false);
      }
    };

    fetchHotelData();
  }, [id]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const showSnackbar = (
    message: string,
    severity: "success" | "error" | "info" | "warning"
  ) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleBooking = async () => {
    try {
      if (!checkIn || !checkOut) {
        showSnackbar(
          "Please select both check-in and check-out dates",
          "error"
        );
        return;
      }

      if (checkOut.isBefore(checkIn) || checkOut.isSame(checkIn)) {
        showSnackbar("Check-out date must be after check-in date", "error");
        return;
      }

      if (checkIn.isBefore(dayjs(), "day")) {
        showSnackbar("Check-in date cannot be in the past", "error");
        return;
      }

      const checkInDate = checkIn.toDate();
      const checkOutDate = checkOut.toDate();

      if (!id) {
        showSnackbar("Invalid hotel ID", "error");
        return;
      }

      const bookingData = {
        hotelId: id,
        checkInDate: checkInDate,
        checkOutDate: checkOutDate,
      };

      await bookingService.createBooking(bookingData);
      showSnackbar("Booking successfully created!", "success");
      setTimeout(() => {
        navigate("/dashboard/booking");
      }, 2000);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Booking failed";
      showSnackbar(errorMessage, "error");
    }
  };

  if (loading) {
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "70vh",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  if (error || !hotel) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h5" color="error" align="center">
          {error || "Hotel not found"}
        </Typography>
      </Container>
    );
  }

  const isCheckOutValid =
    checkIn && checkOut ? checkOut.isAfter(checkIn) : true;

  return (
    <Container
      maxWidth="lg"
      sx={{
        py: 4,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        height: "100vh",
        alignItems: "center",
      }}
    >
      <SlideSnackbar
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />

      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        maxHeight="500px"
        sx={{ width: "100%" }}
      >
        <Typography
          variant="h3"
          component="h3"
          gutterBottom
          fontWeight="semi-bold"
          height="50px"
          fontSize="30px"
        >
          {hotel.name}
        </Typography>
        <ImageContainer>
          {hotel.picture_list && hotel.picture_list.length > 0 && (
            <Carousel list={hotel.picture_list} />
          )}
        </ImageContainer>
      </Box>

      <Box
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        alignItems="flex-start"
        sx={{ width: "100%" }}
      >
        <Card
          elevation={3}
          sx={{
            mt: 4,
            borderRadius: "12px",
            width: { xs: "100%", md: "auto" },
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-evenly",
              height: "100%",
              width: "100%",
            }}
          >
            <Box
              display="flex"
              flexDirection={{ xs: "column", md: "row" }}
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography variant="h6" gutterBottom>
                  Price per night
                </Typography>
                <Typography variant="h4" color="primary" fontWeight="bold">
                  ${hotel.price}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <LocationOnIcon />
                <Typography variant="body1">{hotel.location}</Typography>
              </Box>
            </Box>

            <Typography variant="body1" mt={2}>
              {hotel.description || "No description available for this hotel."}
            </Typography>

            <Box mt={2} mb={2} display="flex" flexDirection="column" gap={2}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker name='checkIn'
                  label="Check-in"
                  value={checkIn}
                  onChange={(date) => setCheckIn(date)}
                  disablePast
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      margin: "dense",
                      InputProps: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <CalendarMonthIcon />
                          </InputAdornment>
                        ),
                      },
                    },
                  }}
                />
              </LocalizationProvider>

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker name='checkOut'
                  label="Check-out"
                  value={checkOut}
                  onChange={(date) => setCheckOut(date)}
                  minDate={checkIn || undefined}
                  disablePast
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      margin: "dense",
                      error: !isCheckOutValid,
                      helperText: !isCheckOutValid
                        ? "Check-out date must be after check-in date"
                        : "",
                      InputProps: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <CalendarMonthIcon />
                          </InputAdornment>
                        ),
                      },
                    },
                  }}
                />
              </LocalizationProvider>
              <Button
                variant="contained"
                size="large"
                fullWidth
                sx={{
                  mt: 2,
                  py: 2,
                  fontSize: "1.1rem",
                  textTransform: "none",
                  borderRadius: "8px",
                }}
                onClick={handleBooking}
              >
                Book Now
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};