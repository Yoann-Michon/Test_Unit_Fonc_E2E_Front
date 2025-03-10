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
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { hotelService } from "../services/Hotel.service";
import { IHotel } from "../models/Hotel.interface";
import { useParams, Link } from "react-router-dom";
import { Carousel } from "../components/Carousel"; 

const ImageContainer = styled(Box)(() => ({
  position: "relative",
  "&:hover": {
    "& .MuiImageListItem-root": {
      transform: "scale(1.05)",
      transition: "transform 0.3s ease-in-out",
    },
  },
}));

export const HotelDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [hotel, setHotel] = useState<IHotel | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        setLoading(true);
        if (id) {
          const hotelData = await hotelService.getHotelById(id);
          console.log(hotelData);

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

  return (
    <Container maxWidth="lg" sx={{ py: 4 , display:'flex', flexDirection:"row", justifyContent:"center",height:"100vh", alignItems:"center"}}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        justifyContent="center"
        maxHeight='500px'
      >
        <Typography variant="h3" component="h3" gutterBottom fontWeight="semi-bold" height="50px" fontSize="30px">
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
        flexDirection="row"
        alignItems="flex-start"
      >
        <Card
          elevation={3}
          sx={{ mt: 4, borderRadius: "12px", width: 400, height: 550 }}
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
            <Typography variant="h6" gutterBottom>
              Price per night
            </Typography>
            <Typography variant="h4" color="primary" fontWeight="bold">
              ${hotel.price}
            </Typography>

            <Box display="flex" alignItems="center" gap={1} mt={2}>
              <LocationOnIcon />
              <Typography variant="body1">{hotel.location}</Typography>
            </Box>

            <Typography variant="body1" paragraph mt={2}>
              {hotel.description || "No description available for this hotel."}
            </Typography>

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
              component={Link}
              to={`/signup`}
            >
              Book Now
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};
