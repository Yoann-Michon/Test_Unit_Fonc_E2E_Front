import { useState } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import { Link } from "react-router-dom";
import { IHotel } from "../models/Hotel.interface";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface HotelCardsProps {
  hotels: IHotel[];
  isAdmin?: Boolean;
  onDelete?: (hotelId: string) => void;
  onEdit?: (hotelId: string, updatedHotel: IHotel) => void;
  onDashboard?:boolean
}

export const HotelCards = ({
  hotels,
  isAdmin,
  onDelete,
  onEdit, onDashboard
}: HotelCardsProps) => {
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (hotelId: string) => {
    setFavorites((prev) =>
      prev.includes(hotelId)
        ? prev.filter((id) => id !== hotelId)
        : [...prev, hotelId]
    );
  };

  return (
    <Box sx={{ py: 4, textAlign: "center" }}>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 4,
        }}
      >
        {hotels.map((hotel) => (
          <Card
            key={hotel.id}
            elevation={3}
            sx={{
              width: 400,
              borderRadius: "12px",
              transition: "transform 0.3s ease-in-out",
              "&:hover": {
                transform: "translateY(-8px)",
              },
            }}
          >
            <CardMedia
              component="img"
              height="250"
              image={hotel.picture_list?.[0]}
              alt={hotel.name}
              sx={{ objectFit: "cover" }}
            />
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                height="25px"
              >
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  {hotel.name}
                </Typography>
                <Box display="flex" flexDirection="row">
                  <IconButton
                    onClick={() => hotel.id && toggleFavorite(hotel.id)}
                  >
                    {hotel.id && favorites.includes(hotel.id) ? (
                      <FavoriteIcon sx={{ color: "#ff1744", fontSize: 20 }} />
                    ) : (
                      <FavoriteBorderIcon sx={{ fontSize: 20 }} />
                    )}
                  </IconButton>
                  {isAdmin && (
                    <Box display="flex" justifyContent="space-between">
                      <IconButton
                        onClick={() =>
                          hotel.id && onEdit && onEdit(hotel.id, hotel)
                        }
                        color="primary"
                      >
                        <EditIcon sx={{ fontSize: 20 }} />
                      </IconButton>
                      <IconButton
                        onClick={() =>
                          hotel.id && onDelete && onDelete(hotel.id)
                        }
                        color="error"
                      >
                        <DeleteIcon sx={{ fontSize: 20 }} />
                      </IconButton>
                    </Box>
                  )}
                </Box>
              </Box>

              <Box
                display="flex"
                alignItems="center"
                gap={1}
                my={1}
                height={30}
              >
                <LocationOnIcon fontSize="small" />
                <Typography variant="body2" color="text.secondary">
                  {hotel.street}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {hotel.location}
                </Typography>
              </Box>

              <Typography variant="body2" color="text.secondary" height={50} sx={{
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 3,
                  overflow: "hidden",
                }}>
                {hotel.description}
              </Typography>

              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mt={2}
              >
                <Typography variant="h6" color="primary" fontWeight="bold">
                  {hotel.price}
                  <Typography
                    component="span"
                    variant="caption"
                    color="text.secondary"
                  >
                    $/night
                  </Typography>
                </Typography>
                <Button
                  variant="contained"
                  sx={{ textTransform: "none", borderRadius: "8px" }}
                  component={Link}
                  to={onDashboard ? `/dashboard/hotel/${hotel.id}` : `/hotel/${hotel.id}`}
                >
                  See more
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};
