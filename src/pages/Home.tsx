import { useState } from "react";
import { Dayjs } from "dayjs";
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Rating,
  styled,
  InputAdornment,
  Paper,
  MenuItem,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import PhoneEnabledIcon from "@mui/icons-material/PhoneEnabled";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import HotelIcon from "@mui/icons-material/Hotel";
import Paris from "../assets/images/Paris.jpg";
import London from "../assets/images/London.jpg";
import Newyork from "../assets/images/Newyork.jpg";
import Tokyo from "../assets/images/Tokyo.jpg";
import Homepage from "../assets/manuel-moreno-DGa0LQ0yDPc-unsplash.jpg";

const HeroSection = styled(Box)({
    height: "100vh",
    backgroundImage: `url(${Homepage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
    },
  });
  
  const SearchBox = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: theme.spacing(1),
    width: "100%",
    maxWidth: 850,
    margin: "0 auto",
    position: "relative",
    zIndex: 1,
  }));

const destinations = [
  { label: "Paris, France", price: "$200-500", image: Paris },
  { label: "New York, USA", price: "$300-700", image: Newyork },
  { label: "Tokyo, Japan", price: "$250-600", image: Tokyo },
  { label: "London, UK", price: "$250-550", image: London },
];

const testimonials = [
  {
    name: "John Doe",
    rating: 5,
    comment: "Excellent service and amazing hotels!",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
  },
  {
    name: "Jane Smith",
    rating: 4,
    comment: "Very satisfied with the booking process.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
  },
];

const DestinationCard = styled(Card)({
  height: 350,
  cursor: "pointer",
  transition: "transform 0.3s",
  "&:hover": {
    transform: "scale(1.03)",
  },
});

export default function Home() {
  const [checkIn, setCheckIn] = useState<Dayjs | null>(null);
  const [checkOut, setCheckOut] = useState<Dayjs | null>(null);
  const [guests, setGuests] = useState<number>(1);
  const [destination, setDestination] = useState<string>("");

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  return (
    <>
      <HeroSection>
        <Container>
          <Typography
            variant="h2"
            color="white"
            align="center"
            sx={{ position: "relative", mb: 4, fontWeight: "bold" }}
          >
            Find Your Perfect Stay
          </Typography>
          <SearchBox elevation={3}>
            <Box
              display="flex"
              flexWrap="wrap"
              gap={2}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                }
              }}
            >
              <TextField
                select
                fullWidth
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOnIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ flex: "1 1 200px" }}
              >
                {destinations.map((option) => (
                  <MenuItem key={option.label} value={option.label}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Check-in"
                  value={checkIn}
                  onChange={(date) => setCheckIn(date)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      InputProps: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <CalendarMonthIcon />
                          </InputAdornment>
                        ),
                      },
                      sx: { flex: "1 1 200px" }
                    },
                  }}
                />
              </LocalizationProvider>

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Check-out"
                  value={checkOut}
                  onChange={(date) => setCheckOut(date)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      InputProps: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <CalendarMonthIcon />
                          </InputAdornment>
                        ),
                      },
                      sx: { flex: "1 1 200px" }
                    },
                  }}
                />
              </LocalizationProvider>

              <TextField
                fullWidth
                label="Guests"
                type="number"
                value={guests}
                onChange={(e) => setGuests(Math.max(1, Number(e.target.value)))}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PeopleAltIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ flex: "1 1 100px" }}
              />
            </Box>
            
            <Button
              variant="contained"
              fullWidth
              size="large"
              color="primary"
              sx={{ 
                mt: 2, 
                py: 1.5,
                backgroundColor: "#1976d2",
                "&:hover": {
                  backgroundColor: "#1565c0"
                }
              }}
            >
              SEARCH HOTELS
            </Button>
          </SearchBox>
        </Container>
      </HeroSection>

      <Container sx={{ my: 8 }}>
        <Typography variant="h4" gutterBottom align="center">
          Popular Destinations
        </Typography>
        <Box display="flex" justifyContent="center" flexWrap="wrap" gap={4}>
          {destinations.map((dest, index) => (
            <DestinationCard key={index}>
              <CardMedia
                component="img"
                height="200"
                image={dest.image}
                alt={dest.label}
              />
              <CardContent>
                <Typography variant="h6">{dest.label}</Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  From {dest.price}
                </Typography>
              </CardContent>
            </DestinationCard>
          ))}
        </Box>
      </Container>

      <Box sx={{ bgcolor: "grey.100", py: 8 }}>
        <Container>
          <Typography variant="h4" gutterBottom align="center">
            Why Choose Us
          </Typography>
          <Box display="flex" justifyContent="center" flexWrap="wrap" gap={4}>
            {[
              {
                icon: <CreditCardIcon />,
                title: "Best Price Guarantee",
              },
              { icon: <HotelIcon />, title: "Wide Range of Hotels" },
              { icon: <CalendarMonthIcon />, title: "Easy Cancellation" },
              { icon: <PhoneEnabledIcon />, title: "24/7 Customer Support" },
            ].map((feature, index) => (
              <Box textAlign="center" key={index} sx={{ width: "25%" }}>
                <IconButton color="primary" sx={{ mb: 2 }}>
                  {feature.icon}
                </IconButton>
                <Typography variant="h6">{feature.title}</Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      <Container sx={{ my: 8 }}>
        <Typography variant="h4" gutterBottom align="center">
          What Our Customers Say
        </Typography>
        <Carousel responsive={responsive} infinite showDots>
          {testimonials.map((testimonial, index) => (
            <Card key={index} sx={{ mx: 2, height: "100%" }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <CardMedia
                    component="img"
                    sx={{ width: 60, height: 60, borderRadius: "50%", mr: 2 }}
                    image={testimonial.image}
                    alt={testimonial.name}
                  />
                  <Box>
                    <Typography variant="h6">{testimonial.name}</Typography>
                    <Rating value={testimonial.rating} readOnly />
                  </Box>
                </Box>
                <Typography variant="body1">{testimonial.comment}</Typography>
              </CardContent>
            </Card>
          ))}
        </Carousel>
      </Container>
    </>
  );
}
